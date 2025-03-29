import { useEffect } from 'react';
import { useNotifications } from './use-notifications';

// Mock notifications data
const mockNotifications = [
  {
    title: 'New Room Invite',
    message: 'John Doe invited you to join "Music Lovers"',
    type: 'room_invite' as const,
  },
  {
    title: 'Mentioned in Chat',
    message: 'Alice mentioned you in "Tech Talk"',
    type: 'mention' as const,
  },
  {
    title: 'Room Activity',
    message: 'New members joined "Gaming Night"',
    type: 'activity' as const,
  }
];

export function useMockNotifications() {
  const notifications = useNotifications();

  useEffect(() => {
    // Add initial mock notifications
    mockNotifications.forEach((notification) => {
      notifications.addNotification({
        ...notification,
        id: Math.random().toString(36).substr(2, 9)
      });
    });

    // Set up periodic notifications
    const interval = setInterval(() => {
      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      notifications.addNotification({
        ...randomNotification,
        id: Date.now().toString()
      });
    }, 30000); // Add a new notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return notifications;
}
