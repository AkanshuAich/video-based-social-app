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
  participantCount: number;
  participantLimit: number;
  participants: MockRoomParticipant[];
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
    username: "sarah_chen",
    displayName: "Sarah Chen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    bio: "Product Designer",
    status: 'online'
  },
  {
    id: 4,
    username: "michael_kim",
    displayName: "Michael Kim",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    bio: "Software Engineer",
    status: 'offline'
  },
  {
    id: 5,
    username: "lisa_chen",
    displayName: "Lisa Chen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    bio: "Lead Designer",
    status: 'speaking'
  },
  {
    id: 6,
    username: "tom_harris",
    displayName: "Tom Harris",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    bio: "UI Designer",
    status: 'online'
  }
];

export const mockRooms: MockRoom[] = [
  {
    id: 1,
    name: "Tech Talk Daily",
    description: "Web3 and Future of Tech",
    hostId: 2, // Alex
    isActive: true,
    roomType: "tech",
    participantCount: 52,
    participantLimit: 100,
    participants: [
      { userId: 2, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false },
      { userId: 3, isSpeaker: true, isMuted: false, role: 'speaker', hasRaisedHand: false },
      { userId: 1, isSpeaker: false, isMuted: true, role: 'listener', hasRaisedHand: false },
      { userId: 4, isSpeaker: false, isMuted: true, role: 'listener', hasRaisedHand: false }
    ]
  },
  {
    id: 2,
    name: "Music Producers Club",
    description: "Beat making workshop",
    hostId: 3, // Sarah
    isActive: true,
    roomType: "music",
    participantCount: 33,
    participantLimit: 50,
    participants: [
      { userId: 3, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false },
      { userId: 5, isSpeaker: true, isMuted: false, role: 'speaker', hasRaisedHand: false },
      { userId: 6, isSpeaker: false, isMuted: true, role: 'listener', hasRaisedHand: false }
    ]
  },
  {
    id: 3,
    name: "Design Critique Session",
    description: "UI/UX designers sharing work and feedback",
    hostId: 5, // Lisa
    isActive: true,
    roomType: "design",
    participantCount: 48,
    participantLimit: 100,
    participants: [
      { userId: 5, isSpeaker: true, isMuted: false, role: 'host', hasRaisedHand: false },
      { userId: 6, isSpeaker: true, isMuted: false, role: 'speaker', hasRaisedHand: false },
      { userId: 2, isSpeaker: false, isMuted: true, role: 'listener', hasRaisedHand: false },
      { userId: 3, isSpeaker: false, isMuted: true, role: 'listener', hasRaisedHand: false }
    ]
  }
];

export const upcomingRooms = [
  {
    id: 4,
    name: "AI in Creative Industries",
    description: "Discussion about the impact of AI in creative fields",
    scheduledTime: "Tomorrow, 7:00 PM",
    hostId: 3,
    hostName: "Sophia Lee",
    hostRole: "AI Researcher",
    hostAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 5,
    name: "Indie Game Dev Meetup",
    description: "Share your projects and get feedback",
    scheduledTime: "Today, 9:30 PM",
    hostId: 6,
    hostName: "David Chen",
    hostRole: "Game Developer",
    hostAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 6,
    name: "Mental Health in Tech",
    description: "Open discussion about wellbeing in the tech industry",
    scheduledTime: "Friday, 6:00 PM",
    hostId: 1,
    hostName: "Jamie Williams",
    hostRole: "Wellbeing Coach",
    hostAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80"
  }
];

export const userRooms = [
  {
    id: 1,
    name: "Tech Talk Daily",
    isActive: true
  },
  {
    id: 7,
    name: "Music Producers",
    isActive: true
  },
  {
    id: 8,
    name: "Chill Lounge",
    isActive: false
  }
];

export const friends = [
  {
    id: 2,
    displayName: "Alex Morgan",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80",
    status: "speaking",
    statusText: "Speaking now"
  },
  {
    id: 3,
    displayName: "Sarah Chen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    status: "online",
    statusText: "Online"
  },
  {
    id: 4,
    displayName: "Michael Kim",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    status: "offline",
    statusText: "Offline"
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
