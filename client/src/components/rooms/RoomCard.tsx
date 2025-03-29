import React, { useState, useRef, useEffect } from 'react';
import { getUserById } from '@/lib/mockData';
import { useRoom } from '@/contexts/RoomContext';
import UserAvatar from './UserAvatar';
import { motion } from 'framer-motion';

interface RoomParticipant {
  userId: number;
  isSpeaker: boolean;
  isMuted: boolean;
  role: string;
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
  const { joinRoom } = useRoom();
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
  
  // Handle room join
  const handleJoinRoom = () => {
    joinRoom(id);
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
          
          <div className="room-circle flex items-center justify-center p-4 rounded-full">
            <div className="relative w-full h-48 flex items-center justify-center">
              {/* Host (Center) */}
              {host && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <UserAvatar 
                    user={host} 
                    size="lg" 
                    isSpeaking={true} 
                    isMuted={false} 
                    role="host"
                    showWaveform={true}
                  />
                </div>
              )}
              
              {/* Speakers around host */}
              {speakers.slice(0, 2).map((speaker, i) => {
                const user = getUserById(speaker.userId);
                if (!user) return null;
                
                return (
                  <div 
                    key={speaker.userId}
                    className={`absolute ${
                      i === 0 ? 'top-1/4 left-1/4' : 'top-1/4 right-1/4'
                    }`}
                  >
                    <UserAvatar 
                      user={user} 
                      size="md" 
                      isSpeaking={!speaker.isMuted} 
                      isMuted={speaker.isMuted} 
                      role={speaker.role}
                      showWaveform={!speaker.isMuted}
                    />
                  </div>
                );
              })}
              
              {/* Listeners around */}
              {listeners.slice(0, 4).map((listener, i) => {
                const user = getUserById(listener.userId);
                if (!user) return null;
                
                const positions = [
                  'bottom-1/4 left-1/3',
                  'bottom-1/4 right-1/3',
                  'bottom-10 right-1/4',
                  'bottom-10 left-1/4'
                ];
                
                return (
                  <div 
                    key={listener.userId}
                    className={`absolute ${positions[i]}`}
                  >
                    <UserAvatar 
                      user={user} 
                      size="sm" 
                      isSpeaking={false} 
                      isMuted={true} 
                      role="listener"
                    />
                  </div>
                );
              })}
              
              {/* More users indicator */}
              {participantCount > 7 && (
                <div className="absolute bottom-10 left-1/4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent border-2 border-border text-xs text-muted">
                    +{participantCount - 7} more
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {participants.slice(0, 3).map(p => {
                  const user = getUserById(p.userId);
                  return user ? (
                    <img 
                      key={p.userId}
                      src={user.avatarUrl} 
                      alt={user.displayName} 
                      className="w-6 h-6 rounded-full border border-card"
                    />
                  ) : null;
                })}
              </div>
              <span className="text-muted text-sm ml-2">{participantCount} people</span>
            </div>
            <button 
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm transition-colors"
              onClick={handleJoinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
