import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockUsers, userRooms } from '@/lib/mockData';
import { motion } from 'framer-motion';

// Get a mock user for demo purposes
const currentUser = mockUsers[0]; // Emma Wilson

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Avatar className="w-28 h-28 border-4 border-primary">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
            <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{currentUser.displayName}</h1>
            <p className="text-muted mb-3">@{currentUser.username}</p>
            <p className="max-w-md mb-4">{currentUser.bio}</p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              <Badge variant="outline">UX Designer</Badge>
              <Badge variant="outline">Voice Creator</Badge>
              <Badge variant="outline">Tech Enthusiast</Badge>
            </div>
            
            <div className="flex gap-4 justify-center md:justify-start">
              <div className="text-center">
                <div className="font-bold">23</div>
                <div className="text-xs text-muted">Rooms</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="text-center">
                <div className="font-bold">142</div>
                <div className="text-xs text-muted">Followers</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="text-center">
                <div className="font-bold">89</div>
                <div className="text-xs text-muted">Following</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="ghost" size="icon">
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
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Profile Content */}
        <Tabs defaultValue="rooms" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="rooms">My Rooms</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Rooms</h2>
              <Button size="sm">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create New
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userRooms.map(room => (
                <Card key={room.id} className={room.isActive ? "border-green-500/30" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{room.name}</CardTitle>
                      {room.isActive ? (
                        <Badge variant="default" className="bg-green-500">
                          <span className="w-2 h-2 bg-background rounded-full mr-1 animate-pulse"></span>
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Offline</Badge>
                      )}
                    </div>
                    <CardDescription>Created 2 weeks ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <Avatar className="w-8 h-8 border-2 border-background">
                          <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" />
                        </Avatar>
                        <Avatar className="w-8 h-8 border-2 border-background">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80" />
                        </Avatar>
                      </div>
                      <Button variant="ghost" size="sm">
                        {room.isActive ? "Join" : "Schedule"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recordings">
            <div className="rounded-lg border border-border p-8 text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mx-auto text-muted mb-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15s-2-3-7-3-7 3-7 3"></path>
                <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                <path d="M17 5.5a4 4 0 0 0-8 0"></path>
                <path d="M5 5.5a4 4 0 0 1 8 0"></path>
              </svg>
              <h3 className="text-lg font-medium mb-2">No Recordings Yet</h3>
              <p className="text-muted mb-4">
                Start recording your voice sessions to save them for later.
              </p>
              <Button>Start Recording</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
                <div className="bg-primary/20 p-2 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-primary" 
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
                </div>
                <div className="flex-1">
                  <p className="font-medium">You hosted a room "Design Critique Session"</p>
                  <p className="text-sm text-muted">2 days ago • 48 participants</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
                <div className="bg-primary/20 p-2 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-primary" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Alex Morgan followed you</p>
                  <p className="text-sm text-muted">3 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
                <div className="bg-primary/20 p-2 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-primary" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">You received 28 likes in "Tech Talk Daily"</p>
                  <p className="text-sm text-muted">1 week ago</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Profile;
