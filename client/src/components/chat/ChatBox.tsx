import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose, roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ id: number; text: string; sender: string }[]>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), text: message, sender: 'You' }]);
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-[25rem] w-80 h-96 bg-background rounded-lg overflow-hidden border border-border z-50 shadow-2xl transition-all duration-300 hover:shadow-primary/20 animate-in fade-in slide-in-from-bottom-2">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 60%, black 100%)'
        }}
      />
      <div className="relative flex flex-col h-full backdrop-blur-sm bg-background/80">
        <div className="flex justify-between items-center p-3 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-foreground">Chat</h3>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 shadow-md transition-all duration-200 hover:translate-y-[-1px] ${
                  msg.sender === 'You'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted text-muted-foreground mr-auto'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70">{msg.sender}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
