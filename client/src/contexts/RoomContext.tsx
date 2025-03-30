import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useRoomData } from '@/hooks/use-room';
import { useAudioInput } from '@/hooks/use-audio-input';
import { getRoomById, getUserById, mockUsers } from '@/lib/mockData';

interface RoomContextType {
  roomId: number | null;
  currentUserId: number | null;
  isMuted: boolean;
  isHandRaised: boolean;
  participants: any[];
  toggleMute: () => void;
  raiseHand: (params: { userId: number; isRaised: boolean }) => void;
  leaveRoom: () => void;
  setRoomId: (id: number | null) => void;
  setCurrentUserId: (id: number | null) => void;
  audioLevel: number;
  wsInstance: WebSocket | null;
  joinRoom: (roomId: number) => void;
  initializeWebSocket: (roomId: number) => void;
  sendVoiceActivity: (activityLevel: number) => void;
  wsReady: boolean;
  isInRoom: boolean;
  currentRoomId: number | null;
  isMockAudio: boolean;
}

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(1); // Mock user ID
  const [isMuted, setIsMuted] = useState(false);
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);
  const [wsReady, setWsReady] = useState(true); // Always true for hackathon demo
  const [isInRoom, setIsInRoom] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { audioLevel, startAudioCapture, stopAudioCapture, isMockAudio } = useAudioInput();
  
  // Mock data: no real hand raising for hackathon demo
  const [isHandRaised, setIsHandRaised] = useState(false);
  
  const participants = [] as any[];

  // Cleanup WS on unmount
  useEffect(() => {
    return () => {
      if (wsInstance) {
        wsInstance.close();
      }
    };
  }, [wsInstance]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const raiseHand = useCallback(({ userId, isRaised }: { userId: number; isRaised: boolean }) => {
    setIsHandRaised(isRaised);
    
    toast({
      title: isRaised ? "Hand Raised" : "Hand Lowered",
      description: isRaised ? "The host will be notified" : "Your hand has been lowered"
    });
  }, [toast]);

  const initializeWebSocket = useCallback((roomId: number) => {
    // For hackathon demo we're not connecting to a real WebSocket, but mock the connection
    console.log(`Initializing mock WebSocket for room ${roomId}`);
    const mockWs = {
      send: (data: string) => {
        // Mock implementation
        console.log('Mock WS send:', data);
      },
      close: () => {
        // Mock implementation
        console.log('Mock WS closed');
      }
    } as unknown as WebSocket;
    
    setWsInstance(mockWs);
    setWsReady(true);
  }, []);

  const cleanupRoomResources = useCallback(() => {
    stopAudioCapture();
    setWsInstance(null);
    setWsReady(false);
    setIsInRoom(false);
    setRoomId(null);
    setCurrentRoomId(null);
  }, [stopAudioCapture]);

  const joinRoom = useCallback((roomId: number) => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "You need to be logged in to join a room",
        variant: "destructive"
      });
      return;
    }

    const room = getRoomById(roomId);
    if (!room) {
      toast({
        title: "Error",
        description: "Room not found",
        variant: "destructive"
      });
      return;
    }

    // Set room state
    setRoomId(roomId);
    setCurrentRoomId(roomId);
    setIsInRoom(true);
    initializeWebSocket(roomId);
    
    // Try to start audio capture
    try {
      startAudioCapture().catch(console.error);
    } catch (err) {
      console.error('Audio capture error:', err);
    }

    toast({
      title: "Joined Room",
      description: `You've joined ${room.name}`,
    });
    
    // Navigate to room
    navigate(`/room/${roomId}`);
  }, [currentUserId, initializeWebSocket, startAudioCapture, toast, navigate]);

  const leaveRoom = useCallback(() => {
    const room = getRoomById(currentRoomId!);
    if (room) {
      toast({
        title: "Left Room",
        description: `You have left ${room.name}`
      });
    }

    // Clean up resources
    cleanupRoomResources();
    
    // Navigate home
    navigate('/');
  }, [cleanupRoomResources, currentRoomId, toast, navigate]);

  const sendVoiceActivity = useCallback((activityLevel: number) => {
    if (wsInstance && wsReady) {
      try {
        const message = {
          type: 'voice_activity',
          data: {
            userId: currentUserId,
            level: activityLevel
          }
        };
        wsInstance.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending voice activity:', error);
      }
    }
  }, [wsInstance, wsReady, currentUserId]);

  useEffect(() => {
    // When mute status changes and the user is in a room, send status to WS
    if (isInRoom && wsInstance && wsReady) {
      try {
        const message = {
          type: 'mute_status',
          data: {
            userId: currentUserId,
            isMuted
          }
        };
        wsInstance.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending mute status:', error);
      }
    }
  }, [isMuted, isInRoom, wsInstance, wsReady, currentUserId]);

  return (
    <RoomContext.Provider value={{
      roomId,
      currentUserId,
      isMuted,
      isHandRaised,
      participants,
      toggleMute,
      raiseHand,
      leaveRoom,
      setRoomId,
      setCurrentUserId,
      audioLevel,
      wsInstance,
      joinRoom,
      initializeWebSocket,
      sendVoiceActivity,
      wsReady,
      isInRoom,
      currentRoomId,
      isMockAudio
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === null) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}
