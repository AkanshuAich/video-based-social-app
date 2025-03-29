import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { insertRoomSchema, insertRoomParticipantSchema } from "@shared/schema";

interface WebSocketWithId extends WebSocket {
  userId?: number;
  roomId?: number;
}

type RoomEvent = {
  type: string;
  roomId: number;
  userId?: number;
  data?: any;
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Track connections by room
  const roomConnections = new Map<number, Set<WebSocketWithId>>();
  
  // WebSocket connection handler
  wss.on('connection', (ws: WebSocketWithId) => {
    console.log('WebSocket connection established');
    
    // Send initial connection acknowledgment
    ws.send(JSON.stringify({ 
      type: 'connection_ack',
      data: { status: 'connected', timestamp: new Date().toISOString() }
    }));
    
    // Set a ping interval to keep the connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
      } else {
        clearInterval(pingInterval);
      }
    }, 30000); // Send ping every 30 seconds
    
    ws.on('message', async (message: string) => {
      try {
        const event: RoomEvent = JSON.parse(message);
        console.log(`Received WebSocket message: ${event.type} for room: ${event.roomId}`);
        
        switch (event.type) {
          case 'join_room': {
            const { roomId, userId } = event;
            if (!roomId || !userId) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Missing roomId or userId in join_room event' }
              }));
              return;
            }
            
            // Validate room exists before joining
            const room = await storage.getRoom(roomId);
            if (!room) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Room not found', roomId }
              }));
              return;
            }
            
            ws.roomId = roomId;
            ws.userId = userId;
            
            // Add user to room participants if not already there
            const participant = await storage.getRoomParticipant(roomId, userId!);
            if (!participant) {
              await storage.addRoomParticipant({ 
                roomId, 
                userId: userId!, 
                isSpeaker: false, 
                isMuted: true,
                role: 'listener'
              });
            }
            
            // Add connection to room
            if (!roomConnections.has(roomId)) {
              roomConnections.set(roomId, new Set());
            }
            roomConnections.get(roomId)!.add(ws);
            
            // Send room state to the new connection
            const participants = await storage.getRoomParticipants(roomId);
            
            const participantsWithDetails = await Promise.all(
              participants.map(async (p) => {
                const user = await storage.getUser(p.userId);
                return { ...p, user };
              })
            );
            
            ws.send(JSON.stringify({
              type: 'room_state',
              roomId,
              data: {
                room,
                participants: participantsWithDetails
              }
            }));
            
            // Broadcast to room that user has joined
            broadcastToRoom(roomId, {
              type: 'user_joined',
              roomId,
              userId,
              data: {
                participant: participantsWithDetails.find(p => p.userId === userId)
              }
            });
            
            break;
          }
          
          case 'leave_room': {
            const { roomId, userId } = event;
            
            // Remove user from room participants
            await storage.removeRoomParticipant(roomId, userId!);
            
            // Broadcast to room that user has left
            broadcastToRoom(roomId, {
              type: 'user_left',
              roomId,
              userId
            });
            
            // Remove connection from room
            const connections = roomConnections.get(roomId);
            if (connections) {
              connections.delete(ws);
              if (connections.size === 0) {
                roomConnections.delete(roomId);
              }
            }
            
            break;
          }
          
          case 'toggle_mute': {
            const { roomId, userId, data } = event;
            const { isMuted } = data;
            
            // Update participant's mute status
            const participant = await storage.getRoomParticipant(roomId, userId!);
            if (participant) {
              await storage.updateRoomParticipant(participant.id, {
                isMuted
              });
              
              // Broadcast mute status change to room
              broadcastToRoom(roomId, {
                type: 'mute_changed',
                roomId,
                userId,
                data: { isMuted }
              });
            }
            
            break;
          }
          
          case 'raise_hand': {
            const { roomId, userId, data } = event;
            const { hasRaisedHand } = data;
            
            // Update participant's raised hand status
            const participant = await storage.getRoomParticipant(roomId, userId!);
            if (participant) {
              await storage.updateRoomParticipant(participant.id, {
                hasRaisedHand
              });
              
              // Broadcast raised hand status change to room
              broadcastToRoom(roomId, {
                type: 'hand_raised',
                roomId,
                userId,
                data: { hasRaisedHand }
              });
            }
            
            break;
          }
          
          case 'make_speaker': {
            const { roomId, userId, data } = event;
            const targetUserId = data.targetUserId;
            
            // Check if requesting user is host
            const participant = await storage.getRoomParticipant(roomId, userId!);
            if (participant && participant.role === 'host') {
              const targetParticipant = await storage.getRoomParticipant(roomId, targetUserId);
              if (targetParticipant) {
                await storage.updateRoomParticipant(targetParticipant.id, {
                  isSpeaker: true,
                  role: 'speaker',
                  hasRaisedHand: false
                });
                
                // Broadcast speaker change to room
                broadcastToRoom(roomId, {
                  type: 'speaker_added',
                  roomId,
                  data: { userId: targetUserId }
                });
              }
            }
            
            break;
          }
          
          case 'remove_speaker': {
            const { roomId, userId, data } = event;
            const targetUserId = data.targetUserId;
            
            // Check if requesting user is host
            const participant = await storage.getRoomParticipant(roomId, userId!);
            if (participant && participant.role === 'host') {
              const targetParticipant = await storage.getRoomParticipant(roomId, targetUserId);
              if (targetParticipant) {
                await storage.updateRoomParticipant(targetParticipant.id, {
                  isSpeaker: false,
                  role: 'listener'
                });
                
                // Broadcast speaker change to room
                broadcastToRoom(roomId, {
                  type: 'speaker_removed',
                  roomId,
                  data: { userId: targetUserId }
                });
              }
            }
            
            break;
          }
          
          case 'voice_active': {
            const { roomId, userId, data } = event;
            
            // Broadcast voice activity to the room
            broadcastToRoom(roomId, {
              type: 'voice_activity',
              roomId,
              userId,
              data
            });
            
            break;
          }
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
    
    // Handle client disconnect or connection close
    ws.on('close', async () => {
      // Clear the ping interval when connection closes
      clearInterval(pingInterval);
      
      console.log(`WebSocket connection closed for user: ${ws.userId}, room: ${ws.roomId}`);
      
      if (ws.roomId && ws.userId) {
        try {
          // Remove user from room participants
          await storage.removeRoomParticipant(ws.roomId, ws.userId);
          
          // Broadcast to room that user has left
          broadcastToRoom(ws.roomId, {
            type: 'user_left',
            roomId: ws.roomId,
            userId: ws.userId
          });
          
          // Remove connection from room
          const connections = roomConnections.get(ws.roomId);
          if (connections) {
            connections.delete(ws);
            if (connections.size === 0) {
              roomConnections.delete(ws.roomId);
            }
          }
        } catch (error) {
          console.error(`Error handling WebSocket close for user ${ws.userId} in room ${ws.roomId}:`, error);
        }
      }
    });
    
    // Handle WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(pingInterval);
    });
    
    // Handle pong messages from client
    ws.on('pong', () => {
      console.log(`Received pong from user: ${ws.userId}`);
    });
  });
  
  // Helper function to broadcast to all users in a room
  function broadcastToRoom(roomId: number, data: RoomEvent) {
    const connections = roomConnections.get(roomId);
    if (connections) {
      const message = JSON.stringify(data);
      connections.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }
  
  // API Routes
  
  // User Routes
  app.get('/api/users', async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });
  
  app.get('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  });
  
  // Room Routes
  app.get('/api/rooms', async (req, res) => {
    const activeOnly = req.query.active === 'true';
    const rooms = await storage.getRooms(activeOnly);
    
    // Add host data to each room
    const roomsWithHost = await Promise.all(
      rooms.map(async (room) => {
        const host = await storage.getUser(room.hostId);
        return { ...room, host };
      })
    );
    
    res.json(roomsWithHost);
  });
  
  app.get('/api/rooms/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const room = await storage.getRoom(id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Add host data
    const host = await storage.getUser(room.hostId);
    
    // Get participants
    const participants = await storage.getRoomParticipants(id);
    
    // Add user data to participants
    const participantsWithUser = await Promise.all(
      participants.map(async (participant) => {
        const user = await storage.getUser(participant.userId);
        return { ...participant, user };
      })
    );
    
    res.json({
      ...room,
      host,
      participants: participantsWithUser
    });
  });
  
  app.post('/api/rooms', async (req, res) => {
    try {
      console.log("Room creation request body:", req.body);
      
      // Make sure the payload matches the expected schema
      const roomData = insertRoomSchema.parse({
        name: req.body.name,
        description: req.body.description,
        hostId: req.body.hostId,
        roomType: req.body.roomType,
        scheduledFor: req.body.scheduledFor,
        participantLimit: req.body.participantLimit || 50
      });
      
      console.log("Validated room data:", roomData);
      const newRoom = await storage.createRoom(roomData);
      console.log("Created room:", newRoom);
      
      // Add host as participant
      await storage.addRoomParticipant({
        roomId: newRoom.id,
        userId: newRoom.hostId,
        isSpeaker: true,
        isMuted: false,
        role: 'host'
      });
      
      // Get host data
      const host = await storage.getUser(newRoom.hostId);
      
      res.status(201).json({ ...newRoom, host });
    } catch (error) {
      console.error("Room creation error:", error);
      res.status(400).json({ 
        message: 'Invalid room data', 
        error: error instanceof Error ? { message: error.message } : error 
      });
    }
  });
  
  // Update room
  app.patch('/api/rooms/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
      const room = await storage.getRoom(id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      
      const updatedRoom = await storage.updateRoom(id, req.body);
      res.json(updatedRoom);
    } catch (error) {
      res.status(400).json({ message: 'Invalid room data', error });
    }
  });
  
  // Delete room
  app.delete('/api/rooms/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    const room = await storage.getRoom(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    await storage.deleteRoom(id);
    res.status(204).send();
  });
  
  // Room participants
  app.get('/api/rooms/:roomId/participants', async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    
    const room = await storage.getRoom(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const participants = await storage.getRoomParticipants(roomId);
    
    // Add user data to participants
    const participantsWithUser = await Promise.all(
      participants.map(async (participant) => {
        const user = await storage.getUser(participant.userId);
        return { ...participant, user };
      })
    );
    
    res.json(participantsWithUser);
  });
  
  // Add participant to room
  app.post('/api/rooms/:roomId/participants', async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    
    try {
      const room = await storage.getRoom(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      
      const participantData = {
        ...req.body,
        roomId
      };
      
      const validatedData = insertRoomParticipantSchema.parse(participantData);
      const participant = await storage.addRoomParticipant(validatedData);
      
      const user = await storage.getUser(participant.userId);
      
      res.status(201).json({ ...participant, user });
    } catch (error) {
      res.status(400).json({ message: 'Invalid participant data', error });
    }
  });
  
  // Remove participant from room
  app.delete('/api/rooms/:roomId/participants/:userId', async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    const userId = parseInt(req.params.userId);
    
    const room = await storage.getRoom(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const removed = await storage.removeRoomParticipant(roomId, userId);
    if (!removed) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    res.status(204).send();
  });
  
  return httpServer;
}
