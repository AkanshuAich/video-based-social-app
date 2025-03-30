import React, { useEffect } from 'react';
import { useRoom } from '@/contexts/RoomContext';
import { useRoomData } from '@/hooks/use-room';
import ActiveRoomView from '@/components/rooms/ActiveRoomView';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Home, Compass, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { getRoomById } from '@/lib/mockData';

interface ActiveRoomProps {
  roomId: number;
}

const ActiveRoom: React.FC<ActiveRoomProps> = ({ roomId }) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { joinRoom, isInRoom, currentRoomId } = useRoom();
  const { room, participants, isLoading, error } = useRoomData(roomId);

  // Join room on mount if not already in it
  useEffect(() => {
    const targetRoom = getRoomById(roomId);
    if (!targetRoom) {
      toast({
        title: "Room Not Found",
        description: "The room you're trying to join doesn't exist.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    if (!isInRoom || currentRoomId !== roomId) {
      joinRoom(roomId);
    }
  }, [roomId, isInRoom, currentRoomId, joinRoom, toast, navigate]);

  if (isLoading || !room) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin mb-4 text-primary" />
          <h3 className="font-medium text-xl">Loading Room...</h3>
          <p className="text-muted">Preparing your experience</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 max-w-xl mx-auto mt-20"
      >
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connection Error</h2>
            <p className="text-muted mb-6">Unable to connect to this room. The room may be offline or at capacity.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return <ActiveRoomView 
    roomId={room.id} 
    roomName={room.name} 
    roomDescription={room.description || ''} 
    participants={participants || []}
  />;
};

export default ActiveRoom;
