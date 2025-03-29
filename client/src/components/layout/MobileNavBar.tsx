import React from 'react';
import { Link, useLocation } from 'wouter';
import { useRoom } from '@/contexts/RoomContext';
import { PlusCircle, Home, Compass, Bell, User } from 'lucide-react';

const MobileNavBar: React.FC = () => {
  const [location, navigate] = useLocation();
  const { isInRoom, currentRoomId } = useRoom();
  
  // Determine if a nav link is active
  const isActive = (path: string) => {
    return location === path;
  };
  
  const handleCreateRoom = () => {
    navigate('/create-room');
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 md:hidden z-10">
      <div className="flex items-center justify-around">
        <Link href="/">
          <div className={`p-2 ${isActive('/') ? 'text-primary' : 'text-muted'} flex flex-col items-center cursor-pointer`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        
        <Link href="/explore">
          <div className={`p-2 ${isActive('/explore') ? 'text-primary' : 'text-muted'} flex flex-col items-center cursor-pointer`}>
            <Compass className="h-5 w-5" />
            <span className="text-xs mt-1">Explore</span>
          </div>
        </Link>
        
        <div 
          className="p-2 text-white bg-primary rounded-full flex flex-col items-center -mt-5 shadow-lg cursor-pointer"
          onClick={handleCreateRoom}
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs mt-1">Create</span>
        </div>
        
        <Link href="/notifications">
          <div className={`p-2 ${isActive('/notifications') ? 'text-primary' : 'text-muted'} flex flex-col items-center cursor-pointer`}>
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Activity</span>
          </div>
        </Link>
        
        <Link href="/profile">
          <div className={`p-2 ${isActive('/profile') ? 'text-primary' : 'text-muted'} flex flex-col items-center cursor-pointer`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavBar;
