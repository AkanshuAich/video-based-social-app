import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoomControlsProps {
  isMuted: boolean;
  isHandRaised: boolean;
  audioActivity?: number; // 0-1 value for audio level
  onToggleMute: () => void;
  onRaiseHand: () => void;
  onLeaveRoom: () => void;
}

const RoomControls: React.FC<RoomControlsProps> = ({
  isMuted,
  isHandRaised,
  audioActivity = 0,
  onToggleMute,
  onRaiseHand,
  onLeaveRoom
}) => {
  const [showChat, setShowChat] = useState(false);
  
  // Audio indicator size based on activity level
  const audioScale = audioActivity * 2 + 1; // Scale from 1 to 3x based on activity
  
  // Limit active animation to when audio input is detected and not muted
  const isAudioActive = !isMuted && audioActivity > 0.05;
  
  return (
    <div className="mt-6 flex items-center justify-center md:justify-between flex-wrap md:flex-nowrap gap-4">
      {/* Secondary Controls */}
      <div className="flex items-center space-x-4 order-2 md:order-1">
        {/* Volume Button */}
        <motion.button 
          className="p-3 bg-accent text-white rounded-full hover:bg-accent/80 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </motion.button>
        
        {/* Raise Hand Button */}
        <motion.button 
          className={`p-3 ${isHandRaised ? 'bg-amber-500' : 'bg-accent'} text-white rounded-full hover:bg-accent/80 transition-colors`}
          onClick={onRaiseHand}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
            <path d="M18 11v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5"></path>
            <path d="M14 7v4"></path>
            <path d="M10 7v4"></path>
            <path d="M10 3 8 7h8l-2-4"></path>
          </svg>
        </motion.button>
        
        {/* Chat Button */}
        {/* <motion.button 
          className={`p-3 ${showChat ? 'bg-primary' : 'bg-accent'} text-white rounded-full hover:bg-accent/80 transition-colors`}
          onClick={() => setShowChat(!showChat)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
        </motion.button> */}
      </div>
      
      {/* Primary Controls */}
      <div className="flex items-center space-x-4 order-1 md:order-2">
        {/* Microphone Button with Audio Indicator */}
        <div className="relative">
          <AnimatePresence>
            {isAudioActive && (
              <motion.div 
                className="absolute inset-0 rounded-full bg-primary opacity-30"
                initial={{ scale: 1 }}
                animate={{ scale: audioScale }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
          
          <motion.button 
            className={`p-3 ${isMuted ? 'bg-red-600' : 'bg-primary'} hover:${isMuted ? 'bg-red-700' : 'bg-primary/90'} text-white rounded-full transition-colors relative z-10`}
            onClick={onToggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? (
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
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            ) : (
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
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
          </motion.button>
        </div>
        
        {/* Leave Room Button */}
        <motion.button 
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors flex items-center"
          onClick={onLeaveRoom}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Leave Room
        </motion.button>
      </div>
    </div>
  );
};

export default RoomControls;
