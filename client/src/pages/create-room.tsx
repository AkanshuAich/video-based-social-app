import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCreateRoom } from '@/hooks/use-room';

// Define room schema with validation rules
const createRoomSchema = z.object({
  name: z.string().min(3, {
    message: "Room name must be at least 3 characters",
  }).max(50, {
    message: "Room name must not exceed 50 characters",
  }),
  description: z.string().min(10, {
    message: "Please provide a description of at least 10 characters",
  }).max(200, {
    message: "Description must not exceed 200 characters",
  }),
  roomType: z.enum(["audio", "video", "text"]),
  visibility: z.enum(["public", "private"]),
  allowHandRaise: z.boolean().default(true),
  participantLimit: z.number().min(2).max(100).default(50),
  scheduledFor: z.string().optional(),
  themeColor: z.string().default('#7C3AED'),
});

type CreateRoomFormValues = z.infer<typeof createRoomSchema>;

interface CreateRoomData {
  name: string;
  description: string;
  hostId: number;
  roomType: string;
  participantLimit: number;
  scheduledFor?: string;
}

const CreateRoomPage: React.FC = () => {
  const [_, navigate] = useLocation();
  const { mutate: createRoom, isPending } = useCreateRoom();
  
  // Room theme options
  const roomThemes = [
    { id: 'casual', name: 'Casual', color: '#7C3AED', icon: '🎧', description: 'Relaxed conversation with friends' },
    { id: 'podcast', name: 'Podcast', color: '#2563EB', icon: '🎙️', description: 'Professional podcast-style format' },
    { id: 'nightclub', name: 'Nightclub', color: '#DB2777', icon: '🎵', description: 'Fun, energetic music discussion' },
    { id: 'conference', name: 'Conference', color: '#059669', icon: '💼', description: 'Formal presentations and Q&A' },
  ];
  
  const [selectedTheme, setSelectedTheme] = React.useState(roomThemes[0]);

  const form = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
      roomType: 'audio',
      visibility: 'public',
      allowHandRaise: true,
      participantLimit: 50,
      themeColor: roomThemes[0].color,
    },
  });

  function onSubmit(values: CreateRoomFormValues) {
    console.log("Form submission values:", values);
    
    // Create room data
    const roomData = {
      name: values.name,
      description: values.description,
      hostId: 1, // Using mock user ID
      roomType: values.roomType,
      participantLimit: Number(values.participantLimit)
    };

    // Handle scheduled date if provided
    // Don't add scheduledFor field at all if it's not provided
    if (values.scheduledFor && values.scheduledFor.trim() !== '') {
      try {
        console.log('Original date value:', values.scheduledFor);
        // For mock API - just pass through the string directly
        // In a real application, we would process it properly server-side
        createRoom({ ...roomData, scheduledFor: values.scheduledFor }, {
          onSuccess: (data) => {
            toast({
              title: "Success!",
              description: "Your room has been created.",
            });
            navigate('/');
          },
          onError: (error) => {
            console.error('Room creation error:', error);
            toast({
              title: "Error",
              description: error.message || "Failed to create room",
              variant: "destructive"
            });
          }
        });
      } catch (error) {
        console.error('Error processing date:', error);
        toast({
          title: "Error",
          description: "Failed to process the scheduled date",
          variant: "destructive"
        });
      }
    } else {
      // Create room without scheduled date
      createRoom(roomData, {
        onSuccess: (data) => {
          toast({
            title: "Success!",
            description: "Your room has been created.",
          });
          navigate('/');
        },
        onError: (error) => {
          console.error('Room creation error:', error);
          toast({
            title: "Error",
            description: error.message || "Failed to create room",
            variant: "destructive"
          });
        }
      });
    }
  }

  const updateTheme = (themeId: string) => {
    const theme = roomThemes.find(t => t.id === themeId);
    if (theme) {
      setSelectedTheme(theme);
      form.setValue('themeColor', theme.color);
    }
  };

  return (
    <div className="p-4 pb-20 md:pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create a New Room</h1>
          <p className="text-muted mt-1">Set up your voice room and invite others to join</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
                <CardDescription>Fill in the details for your new room</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a catchy name for your room" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What will your room be about?" 
                              className="resize-none" 
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="roomType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Room Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="audio" id="audio" />
                                  <label htmlFor="audio" className="text-sm font-medium leading-none cursor-pointer">
                                    Audio Room
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="video" id="video" />
                                  <label htmlFor="video" className="text-sm font-medium leading-none cursor-pointer">
                                    Video Room
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="text" id="text" />
                                  <label htmlFor="text" className="text-sm font-medium leading-none cursor-pointer">
                                    Text Chat
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visibility</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private (Invite Only)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="participantLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Participant Limit</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={2} 
                                max={100} 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value, 10))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <FormField
                        control={form.control}
                        name="scheduledFor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Schedule For (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local" 
                                {...field} 
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                    </div>

                    <FormField
                      control={form.control}
                      name="allowHandRaise"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Allow Hand Raise</FormLabel>
                            <p className="text-sm text-muted">Let listeners request to speak</p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Creating Room...' : 'Create Room'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Room Theme</CardTitle>
                <CardDescription>Choose a look and feel for your room</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roomThemes.map((theme) => (
                    <div 
                      key={theme.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all transform hover:scale-[1.02] ${
                        selectedTheme.id === theme.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                      onClick={() => updateTheme(theme.id)}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg mr-3"
                          style={{ backgroundColor: theme.color }}
                        >
                          {theme.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{theme.name}</h4>
                          <p className="text-xs text-muted">{theme.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Preview</p>
                  <div 
                    className="border rounded-lg p-4 aspect-video flex items-center justify-center"
                    style={{ backgroundColor: selectedTheme.color + '30' }}
                  >
                    <div className="text-center">
                      <div className="inline-block p-3 rounded-full" style={{ backgroundColor: selectedTheme.color }}>
                        <span className="text-xl">{selectedTheme.icon}</span>
                      </div>
                      <p className="mt-2 font-medium" style={{ color: selectedTheme.color }}>{form.watch('name') || 'Your Room Name'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRoomPage;