import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'room_invite' | 'mention' | 'activity';
  read?: boolean;
}

interface NotificationPopoverProps {
  notifications: Notification[];
  onNotificationClick: (id: string) => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  notifications,
  onNotificationClick,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'room_invite':
        return '🎉';
      case 'mention':
        return '💬';
      case 'activity':
        return '🔔';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-muted-foreground hover:text-white rounded-xl hover:bg-accent/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-xl" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center z-20 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {unreadCount}
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-[0_0_25px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-background/95 border-accent/20" align="end">
        <div className="p-3 border-b border-accent/20">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-accent/20">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-accent/20 transition-all duration-300 relative group"
                  onClick={() => onNotificationClick(notification.id)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent transition-opacity duration-300" />
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                    <span className="relative z-10">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <div className="flex-1 text-left relative z-10">
                    <p className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse mt-2" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No notifications
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
