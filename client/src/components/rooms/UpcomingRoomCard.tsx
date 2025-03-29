import React from 'react';
import { motion } from 'framer-motion';

interface UpcomingRoomCardProps {
  id: number;
  name: string;
  description: string;
  scheduledTime: string;
  hostName: string;
  hostRole: string;
  hostAvatar: string;
}

const UpcomingRoomCard: React.FC<UpcomingRoomCardProps> = ({
  id,
  name,
  description,
  scheduledTime,
  hostName,
  hostRole,
  hostAvatar
}) => {
  const handleRemindMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Reminder functionality would go here
    console.log(`Set reminder for room ${id}`);
  };
  
  return (
    <motion.div 
      className="bg-card p-4 rounded-xl border border-border hover:border-border/70 transition-all cursor-pointer"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs bg-accent text-muted px-2 py-1 rounded-full">
          {scheduledTime}
        </span>
        <button 
          className="text-primary text-sm font-medium flex items-center"
          onClick={handleRemindMe}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          Remind me
        </button>
      </div>
      
      <h3 className="font-bold mb-1">{name}</h3>
      <p className="text-muted text-sm mb-3">{description}</p>
      
      <div className="flex items-center">
        <img 
          src={hostAvatar} 
          alt={hostName} 
          className="w-8 h-8 rounded-full object-cover border-2 border-accent"
        />
        <div className="ml-2">
          <div className="text-sm font-medium">{hostName}</div>
          <div className="text-xs text-muted">{hostRole}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingRoomCard;
