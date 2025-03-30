import React, { useState } from 'react';
import { mockRooms, mockUsers } from '@/lib/mockData';
import RoomCard from '@/components/rooms/RoomCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Check, Search } from 'lucide-react';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Categories for filtering
  const categories = [
    { name: 'Tech', value: 'tech' },
    { name: 'Music', value: 'music' },
    { name: 'Design', value: 'design' },
    { name: 'Gaming', value: 'gaming' },
    { name: 'Business', value: 'business' },
    { name: 'Education', value: 'education' }
  ];
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Filter rooms based on search query, tab and selected categories
  const filteredRooms = mockRooms.filter(room => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        room.name.toLowerCase().includes(query) ||
        room.description.toLowerCase().includes(query) ||
        mockUsers.find(u => u.id === room.hostId)?.displayName.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    // Tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'tech' && room.category !== 'tech') return false;
      if (activeTab === 'music' && room.category !== 'music') return false;
      if (activeTab === 'design' && room.category !== 'design') return false;
    }
    
    // Category filter (when using badges)
    if (selectedCategories.length > 0 && !selectedCategories.includes(room.category)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            type="text"
            placeholder="Search rooms, topics, or people..."
            className="pl-10 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <Badge
                key={category.value}
                variant={selectedCategories.includes(category.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCategory(category.value)}
              >
                {selectedCategories.includes(category.value) && (
                  <Check className="mr-1 h-3 w-3" />
                )}
                {category.name}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-lg font-medium mb-2">No rooms found</p>
                <p className="text-muted">Try adjusting your filters or search query</p>
              </div>
            ) : (
              filteredRooms.map(room => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  description={room.description}
                  hostId={room.hostId}
                  isActive={room.isActive}
                  participantCount={room.participantCount}
                  participants={room.participants}
                />
              ))
            )}
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Explore;
