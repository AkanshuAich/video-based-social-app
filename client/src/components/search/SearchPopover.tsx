import React, { useState, useCallback } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from '@/hooks/use-debounce';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  type: 'room' | 'user';
  title: string;
  subtitle?: string;
  image?: string;
  roomType?: 'audio' | 'video' | 'text';
  participantCount?: number;
  isLive?: boolean;
  hostName?: string;
}

interface SearchPopoverProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultClick: (result: SearchResult) => void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({
  onSearch,
  onResultClick,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const searchResults = await onSearch(value);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const getRoomTypeIcon = (type: 'audio' | 'video' | 'text') => {
    switch (type) {
      case 'audio':
        return '🎧';
      case 'video':
        return '📹';
      case 'text':
        return '💬';
      default:
        return '🎯';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-muted-foreground hover:text-white rounded-xl hover:bg-accent/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-xl" />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 relative z-10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-[0_0_25px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-background/95 border-accent/20" align="end">
        <div className="p-3 border-b border-accent/20">
          <Input
            placeholder="Search rooms and users..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-accent/10 border-accent/20 focus:ring-accent/30 focus:border-accent/40 transition-all duration-300"
          />
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-accent/20">
              {results.map((result) => (
                <button
                  key={result.id}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/20 transition-all duration-300 relative group"
                  onClick={() => {
                    onResultClick(result);
                    setOpen(false);
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent transition-opacity duration-300" />
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                    <span className="relative z-10 text-lg">
                      {result.type === 'user' ? '👤' : getRoomTypeIcon(result.roomType || 'text')}
                    </span>
                  </div>
                  <div className="flex-1 text-left relative z-10">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
                        {result.title}
                      </p>
                      {result.type === 'room' && result.isLive && (
                        <Badge variant="destructive" className="text-xs bg-red-500/20 text-red-400">LIVE</Badge>
                      )}
                    </div>
                    {result.subtitle && (
                      <p className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </p>
                    )}
                    {result.type === 'room' && result.roomType && (
                      <div className="flex items-center gap-2 mt-1">
                        {result.hostName && (
                          <span className="text-xs text-muted-foreground">
                            Hosted by {result.hostName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize relative z-10">
                    {result.type}
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No results found
              </p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Start typing to search
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default SearchPopover;
