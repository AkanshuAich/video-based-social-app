import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  isActive?: boolean;
  numBars?: number;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({
  size = 'md',
  color = '#8C5CFF',
  isActive = true,
  numBars = 5
}) => {
  const [heights, setHeights] = useState<number[]>([]);
  const [delays, setDelays] = useState<number[]>([]);
  
  // Determine bar sizes based on component size
  const getBarWidth = () => {
    switch (size) {
      case 'sm': return 2;
      case 'lg': return 4;
      default: return 3;
    }
  };
  
  const getContainerClass = () => {
    switch (size) {
      case 'sm': return 'w-10 h-5';
      case 'lg': return 'w-24 h-10';
      default: return 'w-16 h-8';
    }
  };
  
  // Create random heights and delays for each bar
  useEffect(() => {
    const randomHeights = Array.from({ length: numBars }, () => Math.floor(Math.random() * 5) + 2);
    const randomDelays = Array.from({ length: numBars }, () => Math.random() * 0.5);
    
    setHeights(randomHeights);
    setDelays(randomDelays);
    
    // Periodically update heights if active
    if (isActive) {
      const interval = setInterval(() => {
        setHeights(Array.from({ length: numBars }, () => Math.floor(Math.random() * 5) + 2));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [numBars, isActive]);
  
  const barWidth = getBarWidth();
  
  return (
    <div className={`audio-wave ${getContainerClass()} flex items-center justify-center gap-1`}>
      {heights.map((height, index) => (
        <motion.div
          key={index}
          className="audio-wave-bar rounded-full"
          style={{ 
            width: `${barWidth}px`,
            backgroundColor: color,
            animationDelay: `${delays[index]}s`
          }}
          initial={{ scaleY: 0.5 }}
          animate={{ 
            scaleY: isActive ? [0.5, 1.2, 0.5] : 0.5 
          }}
          transition={{ 
            duration: 1.2, 
            repeat: isActive ? Infinity : 0,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
