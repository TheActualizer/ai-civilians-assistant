import { useState, useEffect } from 'react';
import { Search, History, MessageSquare } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  message: string;
  timestamp: string;
  level: string;
  source?: string;
}

export function MessageHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('Fetching debug messages...');
      const { data, error } = await supabase
        .from('debug_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching debug messages:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load message history"
        });
        return;
      }

      console.log('Fetched messages:', data);
      setMessages(data);
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('debug-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'debug_logs'
        },
        (payload) => {
          console.log('New debug message:', payload);
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new as Message, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const filteredMessages = messages.filter(msg =>
    msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-400/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-400/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search messages..."
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchTerm ? 'No messages found' : 'No messages yet'}
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3 bg-gray-800/30 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-200">
                      {msg.source || 'Debug Console'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getLevelColor(msg.level)}>
                      {msg.level}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}