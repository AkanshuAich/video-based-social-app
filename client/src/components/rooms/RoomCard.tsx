import React, { useState, useRef, useEffect } from 'react';
import { getUserById } from '@/lib/mockData';
import { useRoom } from '@/contexts/RoomContext';
import UserAvatar from './UserAvatar';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

interface RoomParticipant {
  userId: number;
  isSpeaker: boolean;
  isMuted: boolean;
  role: 'host' | 'speaker' | 'listener';
  hasRaisedHand?: boolean;
  user?: any;
}

interface RoomCardProps {
  id: number;
  name: string;
  description: string;
  hostId: number;
  isActive: boolean;
  participantCount: number;
  participants?: RoomParticipant[];
}

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  description,
  hostId,
  isActive,
  participantCount,
  participants = []
}) => {
  const [, navigate] = useLocation();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Host data
  const host = getUserById(hostId);
  
  // Get speakers and listeners
  const speakers = participants.filter(p => p.isSpeaker || p.role === 'host').slice(0, 4);
  const listeners = participants.filter(p => !p.isSpeaker && p.role !== 'host').slice(0, 4);
  
  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };
  
  // Handle room join - directly navigate to room page
  const handleJoinRoom = () => {
    // Navigate directly to room page without waiting for join process
    navigate(`/room/${id}`);
  };
  
  return (
    <motion.div 
      ref={cardRef}
      className="bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30 cursor-pointer room-3d-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div 
        className="room-3d-inner"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="text-muted text-sm">{description}</p>
            </div>
            <span className="bg-green-500/20 text-green-500 text-xs px-3 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Live
            </span>
          </div>
          
          {/* Host */}
          <div className="mb-4">
            <p className="text-xs font-medium text-muted mb-2">Host</p>
            <div className="flex items-center">
              {host && (
                <UserAvatar 
                  user={host}
                  size="sm"
                  isMuted={false}
                  role="host"
                />
              )}
              <div className="ml-2">
                <p className="text-sm font-medium">{host?.displayName}</p>
                <p className="text-xs text-muted">{host?.bio?.split(' ').slice(0, 3).join(' ')}...</p>
              </div>
            </div>
          </div>
          
          {/* Participants */}
          <div className="flex mt-2 space-x-6">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted mb-2">Speaking</p>
              <div className="flex -space-x-2 overflow-hidden">
                {speakers.length > 0 ? (
                  speakers.map((speaker, i) => {
                    const user = getUserById(speaker.userId);
                    if (!user) return null;
                    
                    return (
                      <div key={`speaker-${speaker.userId}`} className="border-2 border-background rounded-full">
                        <UserAvatar 
                          user={user}
                          size="sm"
                          isMuted={speaker.isMuted}
                          role="speaker"
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                    <span>0</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-xs font-medium text-muted mb-2">Listening</p>
              <div className="flex -space-x-2 overflow-hidden">
                {listeners.length > 0 ? (
                  listeners.map((listener, i) => {
                    const user = getUserById(listener.userId);
                    if (!user) return null;
                    
                    return (
                      <div key={`listener-${listener.userId}`} className="border-2 border-background rounded-full">
                        <UserAvatar 
                          user={user}
                          size="sm"
                          isMuted={true}
                          role="listener"
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                    <span>0</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Join Button */}
        <div className="p-4 pt-3 border-t border-border flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex -space-x-1.5 overflow-hidden mr-2">
              {[...speakers, ...listeners].slice(0, 3).map((p, i) => {
                const user = getUserById(p.userId);
                if (!user) return null;
                
                return (
                  <div key={`avatar-${p.userId}`} className="w-6 h-6 rounded-full overflow-hidden border-2 border-background">
                    <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
            <span className="text-xs text-muted">{participantCount} people</span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleJoinRoom();
            }}
            className="px-4 py-1.5 text-sm bg-primary hover:bg-primary/90 text-white rounded-full transition-colors duration-200"
          >
            Join Room
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
