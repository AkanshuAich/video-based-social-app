import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { friends } from '@/lib/mockData';

// Mock notification data
const notifications = [
  {
    id: 1,
    type: 'room_invite',
    title: 'Room Invitation',
    message: 'Emma Wilson invited you to join "Tech Talk Daily"',
    time: '10 min ago',
    isRead: false,
    userId: 1,
  },
  {
    id: 2,
    type: 'new_follower',
    title: 'New Follower',
    message: 'Michael Chen started following you',
    time: '2 hours ago',
    isRead: false,
    userId: 2,
  },
  {
    id: 3,
    type: 'speaker_invite',
    title: 'Speaker Invitation',
    message: 'You were invited to speak in "AI Revolution" room',
    time: '1 day ago',
    isRead: true,
    userId: 3,
  },
  {
    id: 4,
    type: 'room_reminder',
    title: 'Room Starting Soon',
    message: 'The "Music Producers Meetup" room starts in 15 minutes',
    time: '15 min ago',
    isRead: true,
    userId: 4,
  },
  {
    id: 5,
    type: 'hand_raised',
    title: 'Hand Raised',
    message: 'Sarah Johnson raised their hand in "JavaScript Community"',
    time: '5 hours ago',
    isRead: true,
    userId: 5,
  }
];

// Activity tab content
const activities = [
  {
    id: 1,
    type: 'room_created',
    title: 'New Room Created',
    message: 'Emma Wilson created a new room "Web3 Discussion Group"',
    time: '2 hours ago',
    userId: 1,
  },
  {
    id: 2,
    type: 'room_joined',
    title: 'Room Joined',
    message: 'Michael Chen joined "Tech Talk Daily"',
    time: '3 hours ago',
    userId: 2,
  },
  {
    id: 3,
    type: 'speaker_added',
    title: 'New Speaker Added',
    message: 'Lisa Taylor was added as a speaker in "AI Revolution"',
    time: '1 day ago',
    userId: 3,
  }
];

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'notifications' | 'activity'>('notifications');
  
  // Get user avatar by ID from friends mock data
  const getUserAvatar = (userId: number) => {
    const friend = friends.find(f => f.id === userId);
    
    // Default avatars for users not found in friends data
    const defaultAvatars = [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    ];
    
    // If user is found in friends, return their avatar
    if (friend && friend.avatarUrl) {
      return friend.avatarUrl;
    }
    
    // Otherwise return a consistent avatar based on userId
    return defaultAvatars[userId % defaultAvatars.length];
  };
  
  return (
    <div className="p-4 pb-20 md:pb-4 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Activity Center</h1>
          <Badge variant="outline" className="px-2 py-1">
            {notifications.filter(n => !n.isRead).length} new
          </Badge>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <div
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </div>
          <div
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeTab === 'activity' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setActiveTab('activity')}
          >
            Activity Feed
          </div>
        </div>
        
        {activeTab === 'notifications' ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.isRead ? 'opacity-75' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={getUserAvatar(notification.userId)} 
                        alt="User Avatar" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>
                          )}
                        </h3>
                        <span className="text-xs text-muted">{notification.time}</span>
                      </div>
                      <p className="text-sm my-1">{notification.message}</p>
                      <div className="flex mt-3">
                        {notification.type === 'room_invite' && (
                          <>
                            <button className="text-sm bg-primary/90 text-white rounded-md px-3 py-1 mr-2 hover:bg-primary transition-colors">
                              Accept
                            </button>
                            <button className="text-sm bg-muted text-muted-foreground rounded-md px-3 py-1 hover:bg-muted/80 transition-colors">
                              Decline
                            </button>
                          </>
                        )}
                        {notification.type === 'speaker_invite' && (
                          <>
                            <button className="text-sm bg-primary/90 text-white rounded-md px-3 py-1 mr-2 hover:bg-primary transition-colors">
                              Accept
                            </button>
                            <button className="text-sm bg-muted text-muted-foreground rounded-md px-3 py-1 hover:bg-muted/80 transition-colors">
                              Decline
                            </button>
                          </>
                        )}
                        {notification.type === 'room_reminder' && (
                          <button className="text-sm bg-primary/90 text-white rounded-md px-3 py-1 mr-2 hover:bg-primary transition-colors">
                            Join Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={getUserAvatar(activity.userId)} 
                        alt="User Avatar" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{activity.title}</h3>
                        <span className="text-xs text-muted">{activity.time}</span>
                      </div>
                      <p className="text-sm my-1">{activity.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsPage;