import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Camera, Monitor, Users, Globe, Brain, Gauge, Terminal } from 'lucide-react';
import type { SharedComputerState } from '@/types/agent';

interface SharedComputerProps {
  sessionId?: string;
}

export function SharedComputerView({ sessionId }: SharedComputerProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [computerState, setComputerState] = useState<SharedComputerState>({
    active_users: [],
    screen_sharing: {
      active: false,
      resolution: '4K',
      frameRate: 60
    },
    voice_chat: {
      active: false,
      participants: [],
      quality: 'high'
    },
    video_chat: {
      active: false,
      participants: [],
      quality: 'high'
    },
    system_load: {
      cpu: 0,
      memory: 0,
      network: 0
    },
    browser_state: {
      url: 'https://lovable.ai',
      title: 'Claude Terminal Interface',
      is_claude_active: true,
      last_interaction: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (!sessionId) {
      console.log('No session ID provided, cannot initialize shared computer view');
      return;
    }

    console.log('Initializing Claude terminal view:', { sessionId });

    // Subscribe to session updates
    const channel = supabase
      .channel(`shared_computer_${sessionId}`)
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const state = channel.presenceState();
          console.log('Presence state updated:', state);
          setComputerState(prev => ({
            ...prev,
            active_users: Object.keys(state)
          }));
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to Claude terminal updates');
          setIsConnected(true);
          
          await channel.track({
            user_id: sessionId,
            online_at: new Date().toISOString(),
            system_specs: {
              resolution: '4K',
              frameRate: 60,
              quality: 'ultra'
            }
          });

          toast({
            title: "Claude Terminal Connected",
            description: "Live terminal view is now active",
          });
        }
      });

    return () => {
      console.log('Cleaning up Claude terminal subscriptions');
      supabase.removeChannel(channel);
    };
  }, [sessionId, toast]);

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-0">
        <div className="relative w-full h-[800px] rounded-xl overflow-hidden">
          {/* Terminal View */}
          <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm">
            <div className="w-full h-12 bg-gray-900/90 border-b border-gray-700 flex items-center px-4 gap-4">
              <Terminal className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">Claude Terminal Interface</span>
              <div className="ml-auto flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-400" />
                <span className="text-green-400">Active</span>
              </div>
            </div>
            
            {/* Terminal iframe */}
            <div className="w-full h-[calc(100%-3rem)] bg-black/90 p-4">
              <iframe 
                src={`https://terminal.lovable.ai/${sessionId}`}
                className="w-full h-full rounded-lg border border-gray-700"
                style={{ 
                  backgroundColor: 'black',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          </div>

          {/* System metrics */}
          <div className="absolute top-16 left-6 space-y-2">
            <div className="px-4 py-2 bg-gray-800/90 rounded-lg text-sm space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Gauge className="h-4 w-4" />
                <span>System Metrics</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">CPU</span>
                  <span className="text-blue-400">{computerState.system_load.cpu.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">Memory</span>
                  <span className="text-purple-400">{computerState.system_load.memory.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">Network</span>
                  <span className="text-green-400">{computerState.system_load.network.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800/90 px-6 py-3 rounded-full border border-gray-700/50 backdrop-blur-xl">
            <Button
              variant="ghost"
              className={`${computerState.screen_sharing.active ? 'text-green-400' : 'text-gray-400'} hover:text-green-300`}
            >
              <Monitor className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`${computerState.video_chat.active ? 'text-blue-400' : 'text-gray-400'} hover:text-blue-300`}
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`${computerState.voice_chat.active ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-300`}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700/50 rounded-full">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">{computerState.active_users.length}</span>
            </div>
          </div>

          {/* Connection status */}
          <div className="absolute top-6 right-6">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              isConnected ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-yellow-400'
              }`} />
              <span className="text-sm">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}