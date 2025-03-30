import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useRoomData } from '@/hooks/use-room';
import { useAudioInput } from '@/hooks/use-audio-input';
import { getRoomById, getUserById, mockUsers } from '@/lib/mockData';

// For TypeScript
declare global {
  interface Window {
    DEBUG_MODE?: boolean;
  }
}

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
  
  const {
    participants,
    leaveRoom: leaveRoomMutation,
    raiseHand: raiseHandMutation
  } = useRoomData(roomId || 0);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Handle audio capture based on mute state with error handling
  useEffect(() => {
    // Only attempt to manage audio if user is in a room
    if (isInRoom) {
      if (!isMuted) {
        try {
          startAudioCapture().catch(err => {
            // Silent catch for hackathon demo to avoid console errors
            console.log('Using mock audio for hackathon demo');
          });
        } catch (err) {
          // Fallback for any synchronous errors
          console.log('Using mock audio for hackathon demo');
        }
      } else {
        stopAudioCapture();
      }
    }
  }, [isMuted, startAudioCapture, stopAudioCapture, isInRoom]);

  // Mock WebSocket initialization for hackathon demo
  const initializeWebSocket = useCallback((roomId: number) => {
    console.log('Mock WebSocket initialized for room:', roomId);
    // No real WebSocket needed for hackathon
    setWsReady(true);
  }, []);

  // Clean up room resources without navigation or toasts
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
        description: "Please log in first",
        variant: "destructive"
      });
      return;
    }

    // If already in a room, clean up resources first but don't navigate or show toasts
    if (isInRoom && currentRoomId) {
      cleanupRoomResources();
    }

    // For hackathon demo: check if room exists in mock data
    const room = getRoomById(roomId);
    if (!room) {
      toast({
        title: "Error",
        description: "Room not found",
        variant: "destructive"
      });
      return;
    }

    setRoomId(roomId);
    setCurrentRoomId(roomId);
    setIsInRoom(true);
    initializeWebSocket(roomId);
    
    // Try to start audio capture with error handling for hackathon
    try {
      startAudioCapture().catch(() => {
        console.log('Using mock audio for hackathon demo');
      });
    } catch (err) {
      console.log('Using mock audio for hackathon demo');
    }

    toast({
      title: "Joined Room",
      description: `You've joined ${room.name}`,
    });
    
    // Navigate to the room page directly from the context
    navigate(`/room/${roomId}`);
  }, [currentUserId, initializeWebSocket, startAudioCapture, toast, isInRoom, currentRoomId, cleanupRoomResources, navigate]);

  const leaveRoom = useCallback(() => {
    // Clean up resources
    cleanupRoomResources();
    
    toast({
      title: "Left Room",
      description: "You have left the room"
    });
    
    // Add redirection to home page after leaving the room
    navigate('/');
  }, [cleanupRoomResources, toast, navigate]);

  const sendVoiceActivity = useCallback((activityLevel: number) => {
    // Mock sending voice activity for hackathon demo
    if (window.DEBUG_MODE) {
      console.log('Mock sending voice activity:', activityLevel);
    }
  }, []);

  // Get current user's participant data
  const currentParticipant = participants?.find(p => p.userId === currentUserId);
  const isHandRaised = currentParticipant?.hasRaisedHand || false;

  const value = {
    roomId,
    currentUserId,
    isMuted,
    isHandRaised,
    participants: participants || [],
    toggleMute,
    raiseHand: raiseHandMutation,
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
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
