import React, { useState } from 'react';
import RoomCard from '@/components/rooms/RoomCard';
import UpcomingRoomCard from '@/components/rooms/UpcomingRoomCard';
import { useRoomsList } from '@/hooks/use-room';
import { upcomingRooms } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRoom } from '@/contexts/RoomContext';

const Home: React.FC = () => {
  const [, navigate] = useLocation();
  const { rooms, isLoading, error } = useRoomsList();
  const { currentUserId } = useRoom();
  
  // Filter for my rooms section
  const myRooms = rooms.filter(room => {
    // Check if user is the host
    if (room.hostId === currentUserId) return true;
    
    // Check if user is a participant
    return room.participants?.some(p => p.userId === currentUserId);
  });
  
  const handleCreateRoom = () => {
    navigate('/create-room');
  };
  
  return (
    <div className="p-4 animate-fade-in pb-20 md:pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Voice Rooms</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="default" 
              className="rounded-full"
              onClick={handleCreateRoom}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Create Room
            </Button>
          </div>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="live">Live Now</TabsTrigger>
            <TabsTrigger value="my-rooms">Your Rooms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-card/50 rounded-xl h-48 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">Failed to load rooms. Please try again later.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center p-8 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">No active rooms</h3>
                <p className="text-muted-foreground mb-4">Be the first to start a conversation!</p>
                <Button onClick={handleCreateRoom}>Create a Room</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <AnimatePresence>
                  {rooms.filter(room => room.isActive).map(room => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RoomCard
                        id={room.id}
                        name={room.name}
                        description={room.description}
                        hostId={room.hostId}
                        isActive={room.isActive}
                        participantCount={room.participantCount}
                        participants={room.participants}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-rooms">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-card/50 rounded-xl h-48 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">Failed to load your rooms. Please try again later.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : myRooms.length === 0 ? (
              <div className="text-center p-8 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">You haven't joined any rooms yet</h3>
                <p className="text-muted-foreground mb-4">Join a room or create your own!</p>
                <Button onClick={handleCreateRoom}>Create a Room</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <AnimatePresence>
                  {myRooms.map(room => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RoomCard
                        id={room.id}
                        name={room.name}
                        description={room.description}
                        hostId={room.hostId}
                        isActive={room.isActive}
                        participantCount={room.participantCount}
                        participants={room.participants}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Upcoming Rooms</h2>
          <button className="text-primary text-sm hover:underline">View all</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {upcomingRooms.map(room => (
            <UpcomingRoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              description={room.description}
              scheduledTime={room.scheduledTime}
              hostName={room.hostName}
              hostRole={room.hostRole}
              hostAvatar={room.hostAvatar}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
