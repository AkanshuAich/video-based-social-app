// Mock data for rooms and users

export type UserStatus = 'online' | 'offline' | 'speaking';

export interface MockUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  status: UserStatus;
}

export interface MockRoomParticipant {
  userId: number;
  isSpeaker: boolean;
  isMuted: boolean;
  role: 'host' | 'speaker' | 'listener';
  hasRaisedHand: boolean;
}

export interface MockRoom {
  id: number;
  name: string;
  description: string;
  hostId: number;
  isActive: boolean;
  roomType: string;
  category: string;
  participantCount: number;
  participantLimit: number;
  participants: MockRoomParticipant[];
  createdAt?: string;
  scheduledFor?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 1,
    username: "emma_wilson",
    displayName: "Emma Wilson",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    bio: "UX Designer & Voice Room Host",
    status: 'online'
  },
  {
    id: 2,
    username: "alex_morgan",
    displayName: "Alex Morgan",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    bio: "Tech Enthusiast",
    status: 'speaking'
  },
  {
    id: 3,
    username: "maya_patel",
    displayName: "Maya Patel",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    bio: "Software Developer & Podcaster",
    status: 'online'
  },
  {
    id: 4,
    username: "josh_thompson",
    displayName: "Josh Thompson",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    bio: "Marketing & Community Building",
    status: 'offline'
  },
  {
    id: 5,
    username: "sarah_chen",
    displayName: "Sarah Chen",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    bio: "Product Manager & Strategy Consultant",
    status: 'online'
  },
  {
    id: 6,
    username: "marcus_jones",
    displayName: "Marcus Jones",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    bio: "UI/UX Designer & Creative Director",
    status: 'offline'
  },
  {
    id: 7,
    username: "lila_rodriguez",
    displayName: "Lila Rodriguez",
    avatarUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80",
    bio: "Data Scientist & Machine Learning Specialist",
    status: 'online'
  },
  {
    id: 8,
    username: "david_kim",
    displayName: "David Kim",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    bio: "Full-stack Developer & Open Source Contributor",
    status: 'speaking'
  },
  {
    id: 9,
    username: "olivia_smith",
    displayName: "Olivia Smith",
    avatarUrl: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80",
    bio: "VR/AR Developer & Tech Educator",
    status: 'online'
  },
  {
    id: 10,
    username: "ethan_davis",
    displayName: "Ethan Davis",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    bio: "Growth Hacker & Digital Strategist",
    status: 'offline'
  }
];

export const mockRooms: MockRoom[] = [
  {
    id: 1,
    name: "Tech Talk Daily",
    description: "Web3 and Future of Tech",
    hostId: 2,
    isActive: true,
    roomType: "audio",
    category: "tech",
    participantCount: 52,
    participantLimit: 100,
    createdAt: new Date().toISOString(),
    participants: [
      { userId: 2, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false },
      { userId: 3, isSpeaker: true, isMuted: false, role: 'speaker', hasRaisedHand: false },
    ]
  },
  {
    id: 2,
    name: "Design Critique Session",
    description: "Share your work and get feedback",
    hostId: 1,
    isActive: true,
    roomType: "video",
    category: "design",
    participantCount: 15,
    participantLimit: 20,
    createdAt: new Date().toISOString(),
    participants: [
      { userId: 1, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false },
      { userId: 6, isSpeaker: true, isMuted: true, role: 'speaker', hasRaisedHand: false },
    ]
  },
  {
    id: 3,
    name: "Music Production Workshop",
    description: "Learn music production basics",
    hostId: 3,
    isActive: true,
    roomType: "video",
    category: "music",
    participantCount: 25,
    participantLimit: 30,
    createdAt: new Date().toISOString(),
    participants: [
      { userId: 3, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false }
    ]
  },
  {
    id: 4,
    name: "UI/UX Design Trends 2025",
    description: "Discussing latest design trends",
    hostId: 1,
    isActive: true,
    roomType: "video",
    category: "design",
    participantCount: 42,
    participantLimit: 50,
    createdAt: new Date().toISOString(),
    participants: [
      { userId: 1, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false }
    ]
  },
  {
    id: 5,
    name: "Gaming Community Meetup",
    description: "Casual gaming discussion",
    hostId: 4,
    isActive: true,
    roomType: "audio",
    category: "gaming",
    participantCount: 35,
    participantLimit: 50,
    createdAt: new Date().toISOString(),
    participants: [
      { userId: 4, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false }
    ]
  },
  {
    id: 6,
    name: "Business Strategy Session",
    description: "Startup growth strategies",
    hostId: 5,
    isActive: true,
    roomType: "video",
    category: "business",
    participantCount: 18,
    participantLimit: 25,
    createdAt: new Date().toISOString(),
    participants: [
      { userId: 5, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false }
    ]
  },
  {
    id: 7,
    name: "Tech Interview Prep",
    description: "Practice coding interviews",
    hostId: 2,
    isActive: true,
    roomType: "video",
    category: "tech",
    participantCount: 12,
    participantLimit: 15,
    createdAt: new Date().toISOString(),
    participants: [
      { userId: 2, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false }
    ]
  },
  {
    id: 8,
    name: "Education Innovation",
    description: "Future of online learning",
    hostId: 3,
    isActive: true,
    roomType: "audio",
    category: "education",
    participantCount: 28,
    participantLimit: 40,
    createdAt: new Date().toISOString(),
    participants: [
      { userId: 3, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false }
    ]
  }
];

// Adding upcomingRooms to fix home.tsx error
export const upcomingRooms = [
  {
    id: 6,
    name: "AI in Creative Industries",
    description: "Discussion about the impact of AI in creative fields",
    scheduledTime: "Tomorrow, 7:00 PM",
    hostId: 3,
    hostName: "Maya Patel",
    hostRole: "AI Researcher",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 7,
    name: "Indie Game Dev Meetup",
    description: "Share your projects and get feedback",
    scheduledTime: "Today, 9:30 PM",
    hostId: 6,
    hostName: "Marcus Jones",
    hostRole: "Game Developer",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 8,
    name: "Mental Health in Tech",
    description: "Open discussion about wellbeing in the tech industry",
    scheduledTime: "Friday, 6:00 PM",
    hostId: 1,
    hostName: "Emma Wilson",
    hostRole: "Wellbeing Coach",
    hostAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  }
];

// Adding userRooms to fix profile.tsx error
export const userRooms = [
  {
    id: 1,
    name: "Tech Talk Daily",
    isActive: true,
    roomType: "audio"
  },
  {
    id: 2,
    name: "Design Critique Session",
    isActive: true,
    roomType: "video"
  },
  {
    id: 9,
    name: "UX Research Group",
    isActive: true,
    roomType: "text"
  },
  {
    id: 10,
    name: "Chill Lounge",
    isActive: false,
    roomType: "audio"
  }
];

export const friends = [
  {
    id: 2,
    displayName: "Alex Morgan",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80",
    status: "speaking",
    room: {
      id: 1,
      name: "Tech Talk Daily"
    }
  },
  {
    id: 3,
    displayName: "Maya Patel",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
    status: "online"
  },
  {
    id: 5,
    displayName: "Sarah Chen",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    status: "online"
  },
  {
    id: 6,
    displayName: "Marcus Jones",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
    status: "offline"
  }
];

export const notifications = [
  {
    id: 1,
    type: "room_invite",
    fromUser: mockUsers[1], // Alex Morgan
    room: mockRooms[0], // Tech Talk Daily
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isRead: false
  },
  {
    id: 2,
    type: "friend_request",
    fromUser: mockUsers[6], // Lila Rodriguez
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isRead: false
  },
  {
    id: 3,
    type: "room_mention",
    fromUser: mockUsers[2], // Maya Patel
    room: mockRooms[2], // Coding Help Desk
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    isRead: true
  }
];

// Function to get user by ID
export function getUserById(id: number): MockUser | undefined {
  return mockUsers.find(user => user.id === id);
}

// Function to get room by ID
export function getRoomById(id: number): MockRoom | undefined {
  return mockRooms.find(room => room.id === id);
}

// Function to add a new room (for create room functionality)
export function addMockRoom(room: Partial<MockRoom>): MockRoom {
  // Ensure we have a valid ID
  const newId = room.id || mockRooms.length > 0 ? Math.max(...mockRooms.map(r => r.id)) + 1 : 1;
  
  // Create a complete room object with default values for missing properties
  const newRoom: MockRoom = {
    id: newId,
    name: room.name || 'Unnamed Room',
    description: room.description || 'No description provided',
    hostId: room.hostId || 1,
    isActive: room.isActive !== undefined ? room.isActive : true,
    roomType: room.roomType || 'audio',
    category: room.category || 'tech',
    participantCount: room.participantCount || 1,
    participantLimit: room.participantLimit || 50,
    participants: room.participants || [],
    createdAt: room.createdAt || new Date().toISOString(),
    scheduledFor: room.scheduledFor
  };
  
  // Add to mock rooms array
  mockRooms.push(newRoom);
  
  console.log(`Created new room: ${newRoom.name} (ID: ${newRoom.id})`);
  return newRoom;
}
