import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, Trophy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EngineerMessage {
  id: string;
  message: string;
  context: string;
  message_type: string;
  importance_level: number;
  created_at: string;
  metadata: {
    mood?: string;
    energy_level?: string;
    ready_for_challenge?: boolean;
  };
  game_context: {
    challenge_level: number;
    achievement_points: number;
    current_mission: string;
    badges_earned: string[];
  };
}

export function EngineerMessages() {
  const [messages, setMessages] = useState<EngineerMessage[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('ai_engineer_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load engineer messages"
        });
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('engineer-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_engineer_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages(prev => [payload.new as EngineerMessage, ...prev]);
          
          toast({
            title: "New Message",
            description: "The AI Engineer has something to say!",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400 animate-pulse" />
            <CardTitle className="text-gray-100">AI Civil Engineer</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className="bg-blue-500/10 text-blue-400"
          >
            Live Communication
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-4 rounded-lg border border-gray-700 bg-gray-800/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-200">
                      {message.context}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.game_context.achievement_points > 0 && (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                        <Trophy className="h-3 w-3 mr-1" />
                        {message.game_context.achievement_points} pts
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300">{message.message}</p>
                {message.game_context.badges_earned.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {message.game_context.badges_earned.map((badge, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-500/10 text-purple-400">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}