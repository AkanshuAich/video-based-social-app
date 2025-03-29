import React from 'react';
import { useLocation } from 'wouter';
import SearchPopover from '@/components/search/SearchPopover';
import NotificationPopover from '@/components/notifications/NotificationPopover';
import { useSearch } from '@/hooks/use-search';
import { useMockNotifications } from '@/hooks/use-mock-notifications';

interface HeaderBarProps {
  toggleSidebar: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ toggleSidebar }) => {
  const [location, navigate] = useLocation();
  const { searchItems } = useSearch();
  const notifications = useMockNotifications();
  
  // Determine page title based on current route
  const getPageTitle = () => {
    if (location === '/') return 'Discover Rooms';
    if (location === '/explore') return 'Explore';
    if (location.startsWith('/room/')) return 'Active Room';
    if (location === '/profile') return 'Profile';
    if (location === '/notifications') return 'Notifications';
    if (location === '/settings') return 'Settings';
    return 'VoiceWave';
  };

  const handleSearchResult = (result: { id: string; type: string }) => {
    if (result.type === 'room') {
      navigate(`/room/${result.id}`);
    } else if (result.type === 'user') {
      navigate(`/profile/${result.id}`);
    }
  };

  const handleNotificationClick = (id: string) => {
    notifications.markAsRead(id);
    // For demo purposes, let's navigate based on notification type
    const notification = notifications.notifications.find(n => n.id === id);
    if (notification) {
      if (notification.type === 'room_invite') {
        navigate('/room/1'); // Mock room ID
      } else if (notification.type === 'mention') {
        navigate('/room/2'); // Mock room ID
      }
    }
  };
  
  return (
    <header className="navbar sticky top-0 z-10 backdrop-blur-md backdrop-saturate-150 bg-opacity-90 border-b border-border p-4 flex items-center">
      <button 
        className="md:hidden mr-4 text-2xl"
        onClick={toggleSidebar}
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
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      <h1 className="text-xl font-bold">{getPageTitle()}</h1>
      
      <div className="ml-auto flex items-center space-x-4">
        <SearchPopover
          onSearch={searchItems}
          onResultClick={handleSearchResult}
        />
        <NotificationPopover
          notifications={notifications.notifications}
          onNotificationClick={handleNotificationClick}
        />
      </div>
    </header>
  );
};

export default HeaderBar;
