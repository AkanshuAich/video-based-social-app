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
  const filteredRooms = mockRooms
    .filter(room => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          room.name.toLowerCase().includes(query) ||
          room.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(room => {
      // Filter by tab
      if (activeTab === 'all') return true;
      return room.roomType === activeTab;
    })
    .filter(room => {
      // Filter by selected categories
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(room.roomType);
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
          
          <TabsContent value="all" className="m-0">
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredRooms.map(room => (
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
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="rounded-full bg-accent w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-muted" />
                </div>
                <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                <p className="text-muted">Try different search terms or filters</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tech" className="m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredRooms
                .filter(room => room.roomType === 'tech')
                .map(room => (
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
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="music" className="m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredRooms
                .filter(room => room.roomType === 'music')
                .map(room => (
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
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="design" className="m-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredRooms
                .filter(room => room.roomType === 'design')
                .map(room => (
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
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Explore;
