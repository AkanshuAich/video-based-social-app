import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

export interface User {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  isOnline: boolean;
}

export interface RoomParticipant {
  id: number;
  roomId: number;
  userId: number;
  isSpeaker: boolean;
  isMuted: boolean;
  role: string;
  joinedAt: string;
  hasRaisedHand: boolean;
  user?: User;
}

export interface Room {
  id: number;
  name: string;
  description: string;
  hostId: number;
  isActive: boolean;
  createdAt: string;
  scheduledFor?: string;
  roomType: string;
  participantLimit: number;
  participantCount: number;
  host?: User;
  participants?: RoomParticipant[];
}

export function useRoomData(roomId: number) {
  const { toast } = useToast();
  const [isBadRoomId, setIsBadRoomId] = useState(false);
  const [roomState, setRoomState] = useState<{roomId: number, isLoading: boolean, error: any}>({
    roomId,
    isLoading: false,
    error: null
  });
  
  useEffect(() => {
    // Reset state when roomId changes
    setRoomState({
      roomId,
      isLoading: true,
      error: null
    });
    setIsBadRoomId(false);
  }, [roomId]);
  
  // Room query with better error handling
  const roomQuery = useQuery<Room>({
    queryKey: [`/api/rooms/${roomId}`],
    enabled: !!roomId && !isBadRoomId,
    retry: (failureCount, error) => {
      // Don't retry 404 errors (non-existent rooms)
      if (error instanceof Error && error.message.includes('404')) {
        setIsBadRoomId(true);
        return false;
      }
      // Limit retries for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });

  // Update state whenever query status changes
  useEffect(() => {
    setRoomState({
      roomId,
      isLoading: roomQuery.isLoading,
      error: roomQuery.error || null
    });
  }, [roomId, roomQuery.isLoading, roomQuery.error]);

  // Log errors separately using the status
  useEffect(() => {
    if (roomQuery.error) {
      if (roomQuery.error instanceof Error && roomQuery.error.message.includes('404')) {
        console.error(`Room ${roomId} not found`);
        setIsBadRoomId(true);
      } else {
        console.error('Error loading room:', roomQuery.error);
      }
    }
  }, [roomQuery.error, roomId]);

  // Only fetch participants if room exists
  const participantsQuery = useQuery<RoomParticipant[]>({
    queryKey: [`/api/rooms/${roomId}/participants`],
    enabled: !!roomId && !!roomQuery.data && !isBadRoomId && !roomQuery.isLoading,
    retry: (failureCount, error) => {
      // Don't retry if status is 404
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    // Refresh participants every 30 seconds if the room is active
    refetchInterval: roomQuery.data && 'isActive' in roomQuery.data && roomQuery.data.isActive ? 30000 : false
  });
  
  // Log errors for participants query
  useEffect(() => {
    if (participantsQuery.error) {
      console.error(`Error fetching participants for room ${roomId}:`, participantsQuery.error);
    }
  }, [participantsQuery.error, roomId]);
  
  // Join room mutation
  const queryClient = useQueryClient();
  const joinRoomMutation = useMutation({
    mutationFn: async (userId: number) => {
      if (isBadRoomId) {
        throw new Error("Cannot join a non-existent room");
      }
      
      if (!roomQuery.data) {
        throw new Error("Room data not loaded");
      }
      
      console.log(`Attempting to join room ${roomId} with user ${userId}`);
      try {
        const response = await apiRequest('POST', `/api/rooms/${roomId}/participants`, {
          userId,
          isSpeaker: false,
          isMuted: true,
          role: 'listener'
        });
        return response;
      } catch (error) {
        console.error('Error in join room mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log(`Successfully joined room ${roomId}`);
      // Invalidate both room and participants queries
      queryClient.invalidateQueries({ queryKey: [`/api/rooms/${roomId}/participants`] });
      queryClient.invalidateQueries({ queryKey: [`/api/rooms/${roomId}`] });
      
      toast({
        title: "Joined Room",
        description: "You have successfully joined the room",
      });
    },
    onError: (error: Error) => {
      console.error('Join room mutation error:', error);
      toast({
        title: "Failed to join room",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Leave room mutation
  const leaveRoomMutation = useMutation({
    mutationFn: async (userId: number) => {
      console.log(`Attempting to leave room ${roomId} with user ${userId}`);
      try {
        const response = await apiRequest('DELETE', `/api/rooms/${roomId}/participants/${userId}`, undefined);
        return response;
      } catch (error) {
        console.error('Error in leave room mutation:', error);
        // For leave operations, we don't want to throw errors since the
        // user may be leaving a room that no longer exists
        return { success: false };
      }
    },
    onSuccess: () => {
      console.log(`Successfully left room ${roomId}`);
      queryClient.invalidateQueries({ queryKey: [`/api/rooms/${roomId}/participants`] });
      queryClient.invalidateQueries({ queryKey: [`/api/rooms/${roomId}`] });
      
      toast({
        title: "Left Room",
        description: "You have left the room",
      });
    }
  });

  // Raise hand mutation
  const raiseHandMutation = useMutation({
    mutationFn: async ({ userId, isRaised }: { userId: number; isRaised: boolean }) => {
      console.log(`${isRaised ? 'Raising' : 'Lowering'} hand for user ${userId} in room ${roomId}`);
      try {
        const response = await apiRequest('PATCH', `/api/rooms/${roomId}/participants/${userId}`, {
          hasRaisedHand: isRaised
        });
        return response;
      } catch (error) {
        console.error('Error in raise hand mutation:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log(`Successfully ${variables.isRaised ? 'raised' : 'lowered'} hand in room ${roomId}`);
      queryClient.invalidateQueries({ queryKey: [`/api/rooms/${roomId}/participants`] });
      
      toast({
        title: variables.isRaised ? "Hand Raised" : "Hand Lowered",
        description: variables.isRaised ? "You have raised your hand" : "You have lowered your hand",
      });
    },
    onError: (error: Error) => {
      console.error('Raise hand mutation error:', error);
      toast({
        title: "Failed to update hand status",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  return {
    room: roomQuery.data,
    participants: participantsQuery.data,
    isLoading: roomQuery.isLoading,
    isRefetching: roomQuery.isRefetching,
    error: roomQuery.error || (isBadRoomId ? new Error("Room not found") : null),
    joinRoom: joinRoomMutation.mutate,
    leaveRoom: leaveRoomMutation.mutate,
    raiseHand: raiseHandMutation.mutate,
    isJoining: joinRoomMutation.isPending,
    isLeaving: leaveRoomMutation.isPending,
    isRaisingHand: raiseHandMutation.isPending,
    isInvalidRoom: isBadRoomId,
    participantsLoading: participantsQuery.isLoading,
    participantsError: participantsQuery.error,
    roomState: roomState
  };
}

export function useRoomsList() {
  const { toast } = useToast();
  
  const roomsQuery = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });
  
  return {
    rooms: roomsQuery.data || [],
    isLoading: roomsQuery.isLoading,
    error: roomsQuery.error
  };
}

export function useCreateRoom() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const createRoomMutation = useMutation({
    mutationFn: async (roomData: any) => {
      console.log('Sending data to server:', roomData);
      try {
        const response = await apiRequest('POST', '/api/rooms', roomData);
        return response.json();
      } catch (error) {
        console.error("Error in create room api request:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      console.log('Room created successfully:', data);
      return data;
    },
    onError: (error: any) => {
      console.error("Create room mutation error:", error);
      let errorMessage = "Failed to create room. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Failed to create room",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
  
  return {
    mutate: createRoomMutation.mutate,
    isPending: createRoomMutation.isPending,
    data: createRoomMutation.data
  };
}
