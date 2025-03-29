import { 
  users, type User, type InsertUser,
  rooms, type Room, type InsertRoom,
  roomParticipants, type RoomParticipant, type InsertRoomParticipant
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Room methods
  getRoom(id: number): Promise<Room | undefined>;
  getRooms(activeOnly?: boolean): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<Room>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;
  
  // Room participant methods
  getRoomParticipants(roomId: number): Promise<RoomParticipant[]>;
  getRoomParticipant(roomId: number, userId: number): Promise<RoomParticipant | undefined>;
  addRoomParticipant(participant: InsertRoomParticipant): Promise<RoomParticipant>;
  updateRoomParticipant(id: number, participant: Partial<RoomParticipant>): Promise<RoomParticipant | undefined>;
  removeRoomParticipant(roomId: number, userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rooms: Map<number, Room>;
  private roomParticipants: Map<number, RoomParticipant>;
  private userIdCounter: number;
  private roomIdCounter: number;
  private participantIdCounter: number;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.roomParticipants = new Map();
    this.userIdCounter = 1;
    this.roomIdCounter = 1;
    this.participantIdCounter = 1;
    
    // Initialize with some mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock users
    const mockUsers: InsertUser[] = [
      {
        username: "emma_wilson",
        password: "password123",
        displayName: "Emma Wilson",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
        bio: "UX Designer & Voice Room Host"
      },
      {
        username: "alex_morgan",
        password: "password123",
        displayName: "Alex Morgan",
        avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
        bio: "Tech Enthusiast"
      },
      {
        username: "sarah_chen",
        password: "password123",
        displayName: "Sarah Chen",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        bio: "Product Designer"
      },
      {
        username: "michael_kim",
        password: "password123",
        displayName: "Michael Kim",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        bio: "Software Engineer"
      },
      {
        username: "lisa_chen",
        password: "password123",
        displayName: "Lisa Chen",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        bio: "Lead Designer"
      },
      {
        username: "tom_harris",
        password: "password123",
        displayName: "Tom Harris",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
        bio: "UI Designer"
      }
    ];
    
    mockUsers.forEach(user => this.createUser(user));
    
    // Add mock rooms
    const mockRooms: InsertRoom[] = [
      {
        name: "Tech Talk Daily",
        description: "Web3 and Future of Tech",
        hostId: 2, // Alex
        roomType: "tech",
        participantLimit: 100
      },
      {
        name: "Music Producers Club",
        description: "Beat making workshop",
        hostId: 3, // Sarah
        roomType: "music",
        participantLimit: 50
      },
      {
        name: "Design Critique Session",
        description: "UI/UX designers sharing work and feedback",
        hostId: 5, // Lisa
        roomType: "design",
        participantLimit: 30
      }
    ];
    
    mockRooms.forEach(room => this.createRoom(room));
    
    // Add mock room participants
    const mockParticipants: InsertRoomParticipant[] = [
      // Tech Talk Daily Participants
      { roomId: 1, userId: 2, isSpeaker: true, isMuted: false, role: "host" },
      { roomId: 1, userId: 3, isSpeaker: true, isMuted: false, role: "speaker" },
      { roomId: 1, userId: 4, isSpeaker: false, isMuted: true, role: "listener" },
      { roomId: 1, userId: 1, isSpeaker: false, isMuted: true, role: "listener" },
      
      // Music Producers Club Participants
      { roomId: 2, userId: 3, isSpeaker: true, isMuted: false, role: "host" },
      { roomId: 2, userId: 5, isSpeaker: true, isMuted: false, role: "speaker" },
      { roomId: 2, userId: 6, isSpeaker: false, isMuted: true, role: "listener" },
      
      // Design Critique Session Participants
      { roomId: 3, userId: 5, isSpeaker: true, isMuted: false, role: "host" },
      { roomId: 3, userId: 6, isSpeaker: true, isMuted: false, role: "speaker" },
      { roomId: 3, userId: 2, isSpeaker: false, isMuted: true, role: "listener" },
      { roomId: 3, userId: 3, isSpeaker: false, isMuted: true, role: "listener" }
    ];
    
    mockParticipants.forEach(participant => this.addRoomParticipant(participant));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { 
      ...user, 
      id, 
      isOnline: false,
      avatarUrl: user.avatarUrl || null,
      bio: user.bio || null
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Room methods
  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async getRooms(activeOnly: boolean = false): Promise<Room[]> {
    const allRooms = Array.from(this.rooms.values());
    return activeOnly ? allRooms.filter(room => room.isActive) : allRooms;
  }

  async createRoom(roomData: InsertRoom): Promise<Room> {
    const id = this.roomIdCounter++;
    const now = new Date();
    
    const newRoom: Room = {
      ...roomData,
      id,
      isActive: true,
      createdAt: now,
      scheduledFor: roomData.scheduledFor || null,
      description: roomData.description || null,
      participantLimit: roomData.participantLimit || null,
      participantCount: 0
    };
    
    this.rooms.set(id, newRoom);
    return newRoom;
  }

  async updateRoom(id: number, roomData: Partial<Room>): Promise<Room | undefined> {
    const room = await this.getRoom(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...roomData };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async deleteRoom(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }

  // Room participant methods
  async getRoomParticipants(roomId: number): Promise<RoomParticipant[]> {
    return Array.from(this.roomParticipants.values())
      .filter(participant => participant.roomId === roomId);
  }

  async getRoomParticipant(roomId: number, userId: number): Promise<RoomParticipant | undefined> {
    return Array.from(this.roomParticipants.values())
      .find(participant => participant.roomId === roomId && participant.userId === userId);
  }

  async addRoomParticipant(participantData: InsertRoomParticipant): Promise<RoomParticipant> {
    const id = this.participantIdCounter++;
    const now = new Date();
    
    const newParticipant: RoomParticipant = {
      ...participantData,
      id,
      joinedAt: now,
      hasRaisedHand: false,
      isSpeaker: participantData.isSpeaker ?? null,
      isMuted: participantData.isMuted ?? null,
      role: participantData.role ?? null
    };
    
    this.roomParticipants.set(id, newParticipant);
    
    // Update participant count in room
    const room = await this.getRoom(participantData.roomId);
    if (room) {
      await this.updateRoom(room.id, { 
        participantCount: (await this.getRoomParticipants(room.id)).length 
      });
    }
    
    return newParticipant;
  }

  async updateRoomParticipant(id: number, participantData: Partial<RoomParticipant>): Promise<RoomParticipant | undefined> {
    const participant = Array.from(this.roomParticipants.values()).find(p => p.id === id);
    if (!participant) return undefined;
    
    const updatedParticipant = { ...participant, ...participantData };
    this.roomParticipants.set(id, updatedParticipant);
    return updatedParticipant;
  }

  async removeRoomParticipant(roomId: number, userId: number): Promise<boolean> {
    const participant = await this.getRoomParticipant(roomId, userId);
    if (!participant) return false;
    
    const result = this.roomParticipants.delete(participant.id);
    
    // Update participant count in room
    const room = await this.getRoom(roomId);
    if (room) {
      await this.updateRoom(room.id, { 
        participantCount: (await this.getRoomParticipants(room.id)).length 
      });
    }
    
    return result;
  }
}

export const storage = new MemStorage();
