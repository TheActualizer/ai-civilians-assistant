import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Network, GitBranch, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

type AgentInteraction = {
  id: string;
  agent_id: string;
  action: string;
  status: string;
  created_at: string;
};

export function AgentNetwork() {
  const [interactions, setInteractions] = useState<AgentInteraction[]>([]);
  const [activeAgents, setActiveAgents] = useState(0);

  useEffect(() => {
    // Subscribe to real-time interaction updates
    const channel = supabase
      .channel('agent-interactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_interactions'
        },
        (payload) => {
          console.log('Agent interaction update:', payload);
          if (payload.eventType === 'INSERT') {
            setInteractions(prev => [payload.new as AgentInteraction, ...prev].slice(0, 50));
          }
        }
      )
      .subscribe();

    // Fetch initial interactions
    const fetchInteractions = async () => {
      const { data, error } = await supabase
        .from('agent_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching interactions:', error);
        return;
      }

      setInteractions(data);
      setActiveAgents(new Set(data.map(i => i.agent_id)).size);
    };

    fetchInteractions();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'processing':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-100 flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Agent Network Activity
          </CardTitle>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
            {activeAgents} Active Agents
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div 
                key={interaction.id}
                className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/30"
              >
                <Brain className={`h-4 w-4 mt-1 ${getStatusColor(interaction.status)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {interaction.agent_id}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(interaction.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {interaction.action}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(interaction.status)} border-current`}
                >
                  {interaction.status}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}