import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'room_invite' | 'mention' | 'activity';
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotifications = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification: Omit<Notification, 'read'>) =>
    set((state: NotificationStore) => ({
      notifications: [
        {
          ...notification,
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markAsRead: (id: string) =>
    set((state: NotificationStore) => ({
      notifications: state.notifications.map((n: Notification) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearAll: () => set({ notifications: [] }),
}));
