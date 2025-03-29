import { useCallback } from 'react';

export interface SearchResult {
  id: string;
  type: 'room' | 'user';
  title: string;
  subtitle?: string;
  image?: string;
  roomType?: 'audio' | 'video' | 'text';
  participantCount?: number;
  isLive?: boolean;
  hostName?: string;
}

// Mock rooms data
const mockRooms = [
  {
    id: '1',
    name: 'Music Lovers',
    type: 'audio' as const,
    participants: 42,
    isLive: true,
    hostName: 'Alice',
    description: 'A room for music enthusiasts',
    image: '/assets/room-thumbnails/music.jpg'
  },
  {
    id: '2',
    name: 'Tech Talk',
    type: 'video' as const,
    participants: 28,
    isLive: true,
    hostName: 'Bob',
    description: 'Discussing latest tech trends',
    image: '/assets/room-thumbnails/tech.jpg'
  },
  {
    id: '3',
    name: 'Book Club',
    type: 'text' as const,
    participants: 15,
    isLive: false,
    hostName: 'Charlie',
    description: 'Weekly book discussions',
    image: '/assets/room-thumbnails/books.jpg'
  }
];

// Mock users data
const mockUsers = [
  {
    id: 'u1',
    username: 'johndoe',
    displayName: 'John Doe',
    image: '/assets/avatars/user1.jpg'
  },
  {
    id: 'u2',
    username: 'janedoe',
    displayName: 'Jane Doe',
    image: '/assets/avatars/user2.jpg'
  },
  {
    id: 'u3',
    username: 'bobsmith',
    displayName: 'Bob Smith',
    image: '/assets/avatars/user3.jpg'
  }
];

export function useSearch() {
  const searchItems = useCallback(async (query: string): Promise<SearchResult[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const normalizedQuery = query.toLowerCase();

    // Search rooms
    const roomResults = mockRooms
      .filter(room => 
        room.name.toLowerCase().includes(normalizedQuery) ||
        room.description.toLowerCase().includes(normalizedQuery) ||
        room.hostName.toLowerCase().includes(normalizedQuery)
      )
      .map(room => ({
        id: room.id,
        type: 'room' as const,
        title: room.name,
        subtitle: `${room.participants} participants • ${room.type}`,
        image: room.image,
        roomType: room.type,
        participantCount: room.participants,
        isLive: room.isLive,
        hostName: room.hostName
      }));

    // Search users
    const userResults = mockUsers
      .filter(user =>
        user.displayName.toLowerCase().includes(normalizedQuery) ||
        user.username.toLowerCase().includes(normalizedQuery)
      )
      .map(user => ({
        id: user.id,
        type: 'user' as const,
        title: user.displayName,
        subtitle: `@${user.username}`,
        image: user.image
      }));

    // Combine and sort results
    const allResults = [...roomResults, ...userResults];
    
    // Sort by relevance
    return allResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Exact matches first
      if (aTitle === normalizedQuery && bTitle !== normalizedQuery) return -1;
      if (bTitle === normalizedQuery && aTitle !== normalizedQuery) return 1;
      
      // Then starts with matches
      if (aTitle.startsWith(normalizedQuery) && !bTitle.startsWith(normalizedQuery)) return -1;
      if (bTitle.startsWith(normalizedQuery) && !aTitle.startsWith(normalizedQuery)) return 1;
      
      // Then by type (rooms first)
      if (a.type === 'room' && b.type === 'user') return -1;
      if (b.type === 'room' && a.type === 'user') return 1;
      
      return 0;
    });
  }, []);

  return { searchItems };
}
