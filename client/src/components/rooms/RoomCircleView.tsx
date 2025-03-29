import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import UserAvatar from './UserAvatar';
import { getUserById } from '@/lib/mockData';

interface RoomParticipant {
  userId: number;
  isSpeaker: boolean;
  isMuted: boolean;
  role: string;
  hasRaisedHand?: boolean;
  user?: any;
}

interface RoomCircleViewProps {
  host: RoomParticipant;
  speakers: RoomParticipant[];
  listeners: RoomParticipant[];
  currentUserId: number;
}

const RoomCircleView: React.FC<RoomCircleViewProps> = ({
  host,
  speakers,
  listeners,
  currentUserId
}) => {
  const roomRef = useRef<HTMLDivElement>(null);
  
  // Get host user data - handle case where host might be undefined
  const hostUser = host?.userId ? getUserById(host.userId) : null;
  
  return (
    <div className="room-3d-container">
      <motion.div 
        ref={roomRef}
        className="room-3d-inner relative mt-6 bg-background/40 rounded-xl p-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="absolute inset-0 room-circle rounded-xl"></div>
        
        {/* Room Visualization */}
        <div className="relative flex flex-wrap justify-center">
          {/* Host */}
          {host && hostUser && (
            <div className="relative mb-6 mx-4">
              <UserAvatar 
                user={hostUser}
                size="xl"
                isSpeaking={!host.isMuted}
                isMuted={host.isMuted}
                role="host"
                isCurrentUser={host.userId === currentUserId}
                showWaveform={!host.isMuted}
                showName={true}
                showRole={true}
              />
            </div>
          )}
          
          {/* Speakers */}
          <div className="flex flex-wrap justify-center">
            {speakers.map(speaker => {
              const user = getUserById(speaker.userId);
              return user ? (
                <div key={speaker.userId} className="relative mb-6 mx-4">
                  <UserAvatar 
                    user={user}
                    size="lg"
                    isSpeaking={!speaker.isMuted}
                    isMuted={speaker.isMuted}
                    role="speaker"
                    isCurrentUser={speaker.userId === currentUserId}
                    showWaveform={!speaker.isMuted}
                    showName={true}
                    showRole={true}
                  />
                </div>
              ) : null;
            })}
          </div>
          
          {/* Listeners */}
          {listeners.length > 0 && (
            <div className="w-full mt-4">
              <h3 className="text-xs uppercase text-muted font-semibold tracking-wider mb-4 text-center">
                Listeners ({listeners.length})
              </h3>
              <div className="flex flex-wrap justify-center">
                {listeners.slice(0, 6).map(listener => {
                  const user = getUserById(listener.userId);
                  return user ? (
                    <div key={listener.userId} className="m-1">
                      <UserAvatar 
                        user={user}
                        size="sm"
                        isCurrentUser={listener.userId === currentUserId}
                        hasRaisedHand={listener.hasRaisedHand}
                      />
                    </div>
                  ) : null;
                })}
                
                {listeners.length > 6 && (
                  <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent border border-border m-1 text-sm text-muted">
                    +{listeners.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RoomCircleView;
