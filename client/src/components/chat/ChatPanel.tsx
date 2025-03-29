import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRoom } from '@/contexts/RoomContext';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile, Send, X } from 'lucide-react';

interface Message {
  id: string;
  userId: number;
  roomId: number;
  content: string;
  timestamp: string;
  user?: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
}

export function ChatPanel({ isOpen, onClose, roomId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUserId } = useRoom();
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Click outside emoji picker handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && 
          emojiPickerRef.current && 
          !emojiPickerRef.current.contains(event.target as Node) &&
          emojiButtonRef.current &&
          !emojiButtonRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    const message: Message = {
      id: Math.random().toString(),
      userId: currentUserId,
      roomId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      user: {
        id: currentUserId,
        username: 'current_user',
        displayName: 'Current User',
        avatarUrl: '/default-avatar.png'
      }
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentUser = (userId: number) => userId === currentUserId;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background border-l border-border shadow-lg z-50"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Chat</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted pt-10">
                    <p>No messages yet</p>
                    <p className="text-sm">Be the first to send a message!</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        isCurrentUser(message.userId) ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">{message.user?.displayName}</span>
                        <span className="text-xs text-muted">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          isCurrentUser(message.userId)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Google Meet style emoji picker */}
            <div className="relative">
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute bottom-16 right-4 z-10"
                  style={{
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <Picker 
                    data={data} 
                    onEmojiSelect={handleEmojiSelect} 
                    theme="light"
                    previewPosition="none"
                    skinTonePosition="none"
                    navPosition="bottom"
                    perLine={7}
                  />
                </div>
              )}
              
              <form 
                onSubmit={handleSendMessage} 
                className="p-4 border-t border-border flex items-center space-x-2"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  ref={emojiButtonRef}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="hover:bg-accent hover:text-accent-foreground rounded-full"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatPanel;
