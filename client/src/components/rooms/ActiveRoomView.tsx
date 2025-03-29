import React, { useEffect, useState, useCallback } from 'react';
import { getUserById } from '@/lib/mockData';
import { useRoom } from '@/contexts/RoomContext';
import RoomCircleView from './RoomCircleView';
import RoomControls from './RoomControls';
import VideoPanel from '../video/VideoPanel';
import ChatBox from '../chat/ChatBox';
import { useAudioVisualization } from '@/hooks/use-audio-visualization';
import { motion } from 'framer-motion';

interface ActiveRoomViewProps {
  roomId: number;
  roomName: string;
  roomDescription: string;
  participants: any[];
}

const ActiveRoomView: React.FC<ActiveRoomViewProps> = ({
  roomId,
  roomName,
  roomDescription,
  participants
}) => {
  const { 
    leaveRoom, 
    toggleMute, 
    raiseHand, // Assuming raiseHand is a function from useRoom()
    isMuted, 
    currentUserId 
  } = useRoom();
  
  const { 
    startVisualization, 
    stopVisualization,
    averageVolume
  } = useAudioVisualization();

  const [isVideoPanelOpen, setIsVideoPanelOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  useEffect(() => {
    startVisualization();
    return () => stopVisualization();
  }, []);
  
  // Group participants by role - handle potentially undefined or empty participants
  const host = participants?.find(p => p.role === 'host');
  const speakers = participants?.filter(p => p.role === 'speaker' || (p.isSpeaker && p.role !== 'host')) || [];
  const listeners = participants?.filter(p => !p.isSpeaker && p.role !== 'host' && p.role !== 'speaker') || [];
  
  // Get current user's participant data
  const currentParticipant = participants?.find(p => p.userId === currentUserId);
  const isHandRaised = currentParticipant?.hasRaisedHand || false;

  // Handlers
  const toggleRaiseHand = useCallback(() => {
    if (!currentUserId) return;
    raiseHand({ userId: currentUserId, isRaised: !isHandRaised });
  }, [currentUserId, isHandRaised, raiseHand]);

  return (
    <motion.div 
      className="p-4 mb-24 md:mb-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-card to-accent rounded-xl overflow-hidden border border-border">
        <div className="p-4 md:p-6 pb-8">
          {/* Room Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-primary/20 rounded-lg p-2 mr-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-primary" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </div>
              <div>
                <div className="flex items-center">
                  <h2 className="font-bold text-lg md:text-xl">{roomName}</h2>
                  <span className="ml-3 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live
                  </span>
                </div>
                <p className="text-muted text-sm">{roomDescription}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`p-2 ${isChatOpen ? 'text-primary' : 'text-muted'} hover:text-white rounded-full hover:bg-accent/50 transition-colors`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button 
                onClick={() => setIsVideoPanelOpen(!isVideoPanelOpen)}
                className={`p-2 ${isVideoPanelOpen ? 'text-primary' : 'text-muted'} hover:text-white rounded-full hover:bg-accent/50 transition-colors`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M23 7l-7 5 7 5V7z"></path>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </button>
            </div>
          </div>

          {/* Room Circle View */}
          <RoomCircleView 
            host={host}
            speakers={speakers}
            listeners={listeners}
            currentUserId={currentUserId ?? 0}
          />

          {/* Room Controls */}
          <RoomControls 
            isMuted={isMuted}
            isHandRaised={isHandRaised}
            onToggleMute={toggleMute}
            onRaiseHand={toggleRaiseHand}
            onLeaveRoom={leaveRoom}
            audioActivity={averageVolume ?? 0}
          />
        </div>
      </div>

      {/* Chat Box */}
      {isChatOpen && (
        <ChatBox
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          roomId={roomId}
        />
      )}

      {/* Video Panel */}
      {isVideoPanelOpen && (
        <VideoPanel
          isOpen={isVideoPanelOpen}
          onClose={() => setIsVideoPanelOpen(false)}
          roomId={roomId}
        />
      )}
    </motion.div>
  );
};

export default ActiveRoomView;
