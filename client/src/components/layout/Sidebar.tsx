import React from 'react';
import { Link, useLocation } from 'wouter';
import { userRooms, friends } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRoomsList } from '@/hooks/use-room';
import { useRoom } from '@/contexts/RoomContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location, navigate] = useLocation();
  const { rooms } = useRoomsList();
  const { currentUserId } = useRoom();
  
  // Determine if a nav link is active
  const isActive = (path: string) => {
    return location === path;
  };
  
  // Filter for user rooms section
  const myRooms = rooms.filter(room => {
    // Check if user is the host
    if (room.hostId === currentUserId) return true;
    
    // Check if user is a participant
    return room.participants?.some(p => p.userId === currentUserId);
  });
  
  const handleCreateRoom = () => {
    navigate('/create-room');
    if (isOpen) onClose(); // Close mobile sidebar if it's open
  };
  
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`sidebar ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-4 left-0 bottom-4 inset-y-4 mb-4 z-30 md:static md:translate-x-0 md:z-auto transition-transform duration-300 ease-in-out
        md:flex md:w-64 lg:w-72 bg-card flex-shrink-0 border-r border-border flex-col`}
      >
        {/* Logo & App Name */}
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div className="text-primary text-2xl font-bold flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2" 
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
            <span>VoiceWave</span>
          </div>
          
          {/* Close button (mobile only) */}
          <button 
            className="md:hidden p-2 text-muted hover:text-white"
            onClick={onClose}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <Button 
            className="w-full mb-6 font-semibold bg-primary text-white gap-2 hover:bg-primary/90" 
            onClick={handleCreateRoom}
          >
            <PlusCircle className="h-4 w-4" />
            Create Room
          </Button>
          
          <div className="space-y-1 mb-6">
            <Link href="/">
              <div 
                className={`flex items-center p-3 rounded-lg mb-2 transition-colors cursor-pointer ${
                  isActive('/') 
                    ? 'text-white bg-primary/20 hover:bg-primary/30' 
                    : 'text-muted hover:text-white hover:bg-accent/50'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="font-medium">Home</span>
              </div>
            </Link>
            
            <Link href="/explore">
              <div 
                className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                  isActive('/explore') 
                    ? 'text-white bg-primary/20 hover:bg-primary/30' 
                    : 'text-muted hover:text-white hover:bg-accent/50'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                <span className="font-medium">Explore</span>
              </div>
            </Link>
            
            <Link href="/notifications">
              <div 
                className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                  isActive('/notifications') 
                    ? 'text-white bg-primary/20 hover:bg-primary/30' 
                    : 'text-muted hover:text-white hover:bg-accent/50'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
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
                <span className="font-medium">Notifications</span>
              </div>
            </Link>
            
            <Link href="/profile">
              <div 
                className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                  isActive('/profile') 
                    ? 'text-white bg-primary/20 hover:bg-primary/30' 
                    : 'text-muted hover:text-white hover:bg-accent/50'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="font-medium">Profile</span>
              </div>
            </Link>
            
            <Link href="/settings">
              <div 
                className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                  isActive('/settings') 
                    ? 'text-white bg-primary/20 hover:bg-primary/30' 
                    : 'text-muted hover:text-white hover:bg-accent/50'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="font-medium">Settings</span>
              </div>
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase text-muted font-semibold tracking-wider px-3">Your Rooms</h4>
              <button 
                className="text-primary text-xs hover:underline px-3"
                onClick={handleCreateRoom}
              >
                + Create
              </button>
            </div>
            <div className="space-y-2">
              {myRooms.length > 0 ? (
                myRooms.map(room => (
                  <Link key={room.id} href={`/room/${room.id}`}>
                    <div className="flex items-center p-3 text-muted hover:text-white rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <span className={`w-2 h-2 rounded-full mr-3 ${room.isActive ? 'bg-green-500' : 'bg-muted'}`}></span>
                      <span className="font-medium">{room.name}</span>
                      {!room.isActive && <span className="ml-auto text-xs bg-accent py-1 px-2 rounded-full">Offline</span>}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-2 px-3 text-muted text-sm">
                  No rooms yet
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase text-muted font-semibold tracking-wider mb-3 px-3">Friends</h4>
            <div className="space-y-2">
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="relative">
                    <img 
                      src={friend.avatarUrl} 
                      alt={friend.displayName} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-accent"
                    />
                    <span 
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                        friend.status === 'speaking' ? 'bg-green-500' :
                        friend.status === 'online' ? 'bg-green-500' : 'bg-muted'
                      }`}
                    ></span>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{friend.displayName}</div>
                    <div className={`text-xs ${
                      friend.status === 'speaking' ? 'text-green-500' :
                      friend.status === 'online' ? 'text-muted' : 'text-muted'
                    }`}>
                      {friend.statusText}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" 
            alt="Your profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3 truncate">
            <div className="font-medium">Emma Wilson</div>
            <div className="text-xs text-muted">@emmavoice</div>
          </div>
          <button className="ml-auto p-2 text-muted hover:text-white rounded-full hover:bg-accent/50 transition-colors">
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
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
