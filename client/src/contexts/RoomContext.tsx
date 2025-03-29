import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useRoomData } from '@/hooks/use-room';
import { useAudioInput } from '@/hooks/use-audio-input';

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
}

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(1); // Mock user ID
  const [isMuted, setIsMuted] = useState(false);
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);
  const [wsReady, setWsReady] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { audioLevel, startAudioCapture, stopAudioCapture } = useAudioInput();
  
  const {
    participants,
    leaveRoom: leaveRoomMutation,
    raiseHand: raiseHandMutation
  } = useRoomData(roomId || 0);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Handle audio capture based on mute state
  useEffect(() => {
    if (!isMuted) {
      startAudioCapture();
    } else {
      stopAudioCapture();
    }
  }, [isMuted, startAudioCapture, stopAudioCapture]);

  // Handle room leaving
  const leaveRoom = useCallback(() => {
    // First attempt to use the mutation if we have both roomId and userId
    if (currentUserId && roomId) {
      console.log(`Leaving room ${roomId} with user ${currentUserId} via mutation`);
      leaveRoomMutation(currentUserId);
      setRoomId(null);
      setCurrentUserId(null);
      setIsMuted(true);
      stopAudioCapture();
      setIsInRoom(false);
      setCurrentRoomId(null);
      setWsReady(false);
      navigate('/');
    }
    // Fallback for when we only have isInRoom state
    else if (isInRoom) {
      console.log('Leaving room via local state cleanup');
      setIsInRoom(false);
      setCurrentRoomId(null);
      setWsReady(false);
      setIsMuted(true);
      stopAudioCapture();
      navigate('/');
      
      toast({
        title: 'Room Left',
        description: 'You have left the room.',
      });
    }
  }, [currentUserId, roomId, isInRoom, leaveRoomMutation, stopAudioCapture, navigate, toast]);

  // Get current user's participant data
  const currentParticipant = participants?.find(p => p.userId === currentUserId);
  const isHandRaised = currentParticipant?.hasRaisedHand || false;

  const initializeWebSocket = useCallback((roomId: number) => {
    try {
      // In a real app, this would connect to your WebSocket server
      // For now, we'll simulate a successful connection
      console.log('Initializing WebSocket for room:', roomId);
      setWsReady(true);
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      setWsReady(false);
      throw error;
    }
  }, []);

  const joinRoom = useCallback((roomId: number) => {
    try {
      console.log('Joining room:', roomId);
      setCurrentRoomId(roomId);
      setIsInRoom(true);
      navigate(`/room/${roomId}`);
      
      toast({
        title: 'Room Joined',
        description: 'You have successfully joined the room.',
      });
    } catch (error) {
      console.error('Error joining room:', error);
      setIsInRoom(false);
      setCurrentRoomId(null);
      throw error;
    }
  }, [navigate, toast]);

  const sendVoiceActivity = useCallback((activityLevel: number) => {
    if (wsInstance && wsReady) {
      // In a real app, send voice activity through WebSocket
      console.log('Voice activity:', activityLevel);
    }
  }, [wsInstance, wsReady]);

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
    currentRoomId
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}
