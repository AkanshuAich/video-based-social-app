import React from 'react';
import AudioWaveform from './AudioWaveform';
import { motion } from 'framer-motion';

interface User {
  id: number;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  status?: string;
}

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  isMuted?: boolean;
  role?: 'host' | 'speaker' | 'listener';
  isCurrentUser?: boolean;
  showWaveform?: boolean;
  hasRaisedHand?: boolean;
  showName?: boolean;
  showRole?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  isSpeaking = false,
  isMuted = true,
  role = 'listener',
  isCurrentUser = false,
  showWaveform = false,
  hasRaisedHand = false,
  showName = false,
  showRole = false
}) => {
  // Size classes for different avatar sizes
  const sizeClasses = {
    sm: 'w-12 h-12 md:w-14 md:h-14',
    md: 'w-14 h-14 md:w-16 md:h-16',
    lg: 'w-16 h-16 md:w-20 md:h-20',
    xl: 'w-20 h-20 md:w-24 md:h-24'
  };
  
  // Border classes for different roles
  const borderClasses = {
    host: 'border-primary',
    speaker: 'border-blue-500',
    listener: 'border-border'
  };
  
  // Badge classes for roles
  const badgeClasses = {
    host: 'bg-primary',
    speaker: 'bg-blue-500',
    listener: 'bg-border'
  };
  
  // Badge icons
  const roleIcons = {
    host: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-3.5 w-3.5 mr-1" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      </svg>
    ),
    speaker: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-3.5 w-3.5 mr-1" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      </svg>
    ),
    listener: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-3.5 w-3.5 mr-1" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
      </svg>
    )
  };
  
  // Determine avatar glow class
  const glowClass = isSpeaking 
    ? 'avatar-glow-speaking' 
    : role === 'speaker' && !isMuted 
      ? 'avatar-glow-active' 
      : '';
  
  // Waveform size based on avatar size
  const waveformSize = size === 'xl' ? 'lg' : size === 'lg' ? 'md' : 'sm';
  
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        {/* Avatar Image */}
        <motion.div 
          className={`${sizeClasses[size]} rounded-full border-2 ${borderClasses[role]} p-1 ${glowClass} ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={user.avatarUrl} 
            alt={user.displayName} 
            className="rounded-full w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Microphone Status Badge */}
        {(role === 'host' || role === 'speaker') && (
          <div 
            className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 ${badgeClasses[role]} text-xs rounded-full px-2 py-0.5 flex items-center ${size === 'sm' ? 'scale-75' : ''}`}
          >
            {isMuted ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3.5 w-3.5 mr-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
              </svg>
            ) : roleIcons[role]}
            {size !== 'sm' && role === 'host' && 'Host'}
          </div>
        )}
        
        {/* Raised Hand Indicator */}
        {hasRaisedHand && (
          <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3.5 w-3.5" 
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
          </div>
        )}
        
        {/* Audio Waveform */}
        {showWaveform && (
          <div className={`waveform-container w-full absolute -top-${size === 'xl' ? '8' : '6'} left-0 flex justify-center`}>
            <AudioWaveform
              size={waveformSize}
              isActive={!isMuted}
              color={role === 'host' ? '#8C5CFF' : '#2196F3'}
            />
          </div>
        )}
      </div>
      
      {/* User Name and Role */}
      {showName && (
        <div className="text-center mt-2">
          <div className="font-medium">{user.displayName}</div>
          {showRole && (
            <div className="text-xs text-muted">
              {role === 'host' ? 'Host' : role === 'speaker' ? 'Speaker' : 'Listener'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
