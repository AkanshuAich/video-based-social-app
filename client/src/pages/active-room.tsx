import React, { useEffect, useState } from 'react';
import { useRoom } from '@/contexts/RoomContext';
import { useRoomData } from '@/hooks/use-room';
import ActiveRoomView from '@/components/rooms/ActiveRoomView';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Home, Compass, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface ActiveRoomProps {
  roomId: number;
}

const ActiveRoom: React.FC<ActiveRoomProps> = ({ roomId }) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { isInRoom, joinRoom, currentRoomId, initializeWebSocket, leaveRoom, wsReady } = useRoom();
  const { room, participants, isLoading, error } = useRoomData(roomId);
  
  const [isValidRoom, setIsValidRoom] = useState<boolean>(true);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  
  // Check if the room exists as early as possible
  useEffect(() => {
    if (error) {
      console.error(`Room ${roomId} not found`);
      setIsValidRoom(false);
      
      // If already in a room, leave it when we detect an error
      if (isInRoom && currentRoomId === roomId) {
        leaveRoom();
      }
    }
  }, [error, roomId, isInRoom, currentRoomId, leaveRoom]);
  
  // Reset initialization state when roomId changes
  useEffect(() => {
    setInitializationAttempted(false);
    setConnectionRetries(0);
  }, [roomId]);
  
  // Initialize WebSocket connection
  useEffect(() => {
    // Only try to initialize if the room is valid and we haven't reached max retries
    if (roomId && !isInRoom && !initializationAttempted && isValidRoom && connectionRetries < 3) {
      try {
        console.log('Initializing WebSocket connection for room:', roomId);
        initializeWebSocket(roomId);
        setInitializationAttempted(true);
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        setConnectionRetries(prev => prev + 1);
        
        if (connectionRetries >= 2) {
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to the room. Please try again later.',
            variant: 'destructive',
          });
        }
      }
    }
  }, [roomId, isInRoom, initializationAttempted, isValidRoom, connectionRetries, initializeWebSocket, toast]);
  
  // Join room logic
  useEffect(() => {
    // Auto-join room when websocket is ready, room data is loaded, and we're not already in this room
    if (roomId && wsReady && !isInRoom && currentRoomId !== roomId && isValidRoom && room) {
      try {
        console.log('Joining room:', roomId);
        joinRoom(roomId);
      } catch (error) {
        console.error('Error joining room:', error);
        toast({
          title: 'Error',
          description: 'Failed to join the room. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }, [roomId, wsReady, isInRoom, currentRoomId, isValidRoom, room, joinRoom, toast]);
  
  // Clean up when component unmounts 
  useEffect(() => {
    return () => {
      if (isInRoom && currentRoomId === roomId) {
        console.log('Leaving room on unmount:', roomId);
        leaveRoom();
      }
    };
  }, [isInRoom, currentRoomId, roomId, leaveRoom]);
  
  const handleRetry = () => {
    setIsValidRoom(true);
    setInitializationAttempted(false);
    setConnectionRetries(0);
    navigate(`/room/${roomId}`);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h3 className="mt-4 text-lg font-medium">Loading room...</h3>
          <p className="text-muted-foreground mt-2">Connecting to voice server...</p>
        </div>
      </div>
    );
  }
  
  // Error state - Room not found
  if (error || !isValidRoom) {
    return (
      <div className="p-4 animate-fade-in">
        <Card className="border-destructive/30">
          <CardContent className="pt-6 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-medium">Room Not Found</h3>
            <p className="mt-2 text-muted-foreground text-center">
              The room you're looking for doesn't exist or may have ended.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
                <Home className="h-4 w-4" /> Go Home
              </Button>
              <Button onClick={() => navigate('/explore')} className="gap-2">
                <Compass className="h-4 w-4" /> Explore Rooms
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRetry} 
              className="mt-4 text-muted-foreground flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Retry connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // No room data but no error state
  if (!room) {
    return (
      <div className="p-4 animate-fade-in">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Room Not Available</h3>
            <p className="mt-2 text-muted-foreground text-center">
              This room is no longer available or may have been deleted.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
                <Home className="h-4 w-4" /> Go Home
              </Button>
              <Button onClick={() => navigate('/explore')} className="gap-2">
                <Compass className="h-4 w-4" /> Explore Rooms
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRetry} 
              className="mt-4 text-muted-foreground flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Retry connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Ensure we have a valid array of participants
  const activeParticipants = Array.isArray(participants) ? participants : [];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="animate-fade-in"
    >
      <ActiveRoomView
        roomId={typeof room === 'object' && 'id' in room ? room.id : 0}
        roomName={typeof room === 'object' && 'name' in room ? room.name : 'Unknown Room'}
        roomDescription={typeof room === 'object' && 'description' in room ? room.description : ''}
        participants={activeParticipants}
      />
    </motion.div>
  );
};

export default ActiveRoom;
