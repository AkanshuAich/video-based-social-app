import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockRooms, mockUsers, getRoomById, getUserById } from './mockData';

// Mock API request function for frontend-only application
export async function apiRequest(method: string, url: string, data?: any): Promise<any> {
  console.log(`Mock API request: ${method} ${url}`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return success response
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, data }),
    text: () => Promise.resolve(JSON.stringify({ success: true, data }))
  };
}

type UnauthorizedBehavior = "returnNull" | "throw";

// Fix the type definition for the query function
export const getQueryFn = <T>({ on401: unauthorizedBehavior }: { on401: UnauthorizedBehavior }): QueryFunction<T> => {
  return async ({ queryKey }) => {
    try {
      const url = queryKey[0] as string;
      let result: any = [];
      
      // Parse the URL to determine what data to return
      if (url.includes('/api/rooms') && !url.includes('/participants')) {
        // Room endpoints
        const roomIdMatch = url.match(/\/api\/rooms\/(\d+)/);
        if (roomIdMatch) {
          const roomId = parseInt(roomIdMatch[1]);
          const room = getRoomById(roomId);
          if (!room) throw new Error('404: Room not found');
          result = room;
        } else {
          result = mockRooms;
        }
      } else if (url.includes('/api/rooms') && url.includes('/participants')) {
        // Participants endpoints
        const roomIdMatch = url.match(/\/api\/rooms\/(\d+)\/participants/);
        if (roomIdMatch) {
          const roomId = parseInt(roomIdMatch[1]);
          const room = getRoomById(roomId);
          
          if (!room) throw new Error('404: Room not found');
          
          // Return participants with user data
          result = room.participants.map(participant => {
            const user = getUserById(participant.userId);
            return {
              ...participant,
              id: participant.userId,
              roomId,
              joinedAt: new Date().toISOString(),
              user: user ? {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                isOnline: user.status === 'online' || user.status === 'speaking'
              } : undefined
            };
          });
        }
      } else if (url.includes('/api/users')) {
        // User endpoints
        if (url === '/api/users') {
          result = mockUsers;
        } else {
          const userIdMatch = url.match(/\/api\/users\/(\d+)/);
          if (userIdMatch) {
            const userId = parseInt(userIdMatch[1]);
            const user = getUserById(userId);
            if (!user) throw new Error('404: User not found');
            result = user;
          }
        }
      }
      
      // Return the result as type T
      return result as T;
    } catch (error) {
      if (unauthorizedBehavior === "returnNull" && error instanceof Error && error.message.includes('401')) {
        return null as unknown as T;
      }
      throw error;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
