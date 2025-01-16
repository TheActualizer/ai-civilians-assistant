import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Camera, Mic, Users, Globe, Brain, Gauge } from 'lucide-react';
import type { SharedComputerState } from '@/types/agent';

interface SharedComputerProps {
  sessionId?: string;
}

export function SharedComputerView({ sessionId }: SharedComputerProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [computerState, setComputerState] = useState<SharedComputerState>({
    screen_sharing: {
      active: false,
      userId: null
    },
    voice_chat: {
      active: false,
      participants: []
    },
    video_chat: {
      active: false,
      participants: []
    },
    active_users: [],
    system_metrics: {
      cpu: 0,
      memory: 0,
      network: 0
    },
    browser_state: {
      url: 'https://lovable.ai',
      title: 'Lovable AI Interface',
      isClaudeActive: true,
      lastInteraction: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (!sessionId) {
      console.log('No session ID provided, cannot initialize shared computer view');
      return;
    }

    console.log('Initializing shared computer view:', { sessionId });

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
      .on(
        'presence',
        { event: 'join' },
        ({ key, newPresences }) => {
          console.log('User joined:', { key, newPresences });
          toast({
            title: "New user joined",
            description: `User ${key} joined the session`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shared_computer_sessions',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Session state updated:', payload);
          if (payload.new) {
            setComputerState(prev => ({
              ...prev,
              ...payload.new
            }));
          }
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to updates');
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
        }
      });

    const metricsInterval = setInterval(() => {
      setComputerState(prev => ({
        ...prev,
        system_metrics: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          network: Math.random() * 100
        }
      }));
    }, 2000);

    return () => {
      console.log('Cleaning up shared computer subscriptions');
      clearInterval(metricsInterval);
      supabase.removeChannel(channel);
    };
  }, [sessionId, toast]);

  const toggleSharing = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('shared-computer', {
        body: {
          action: 'update_state',
          data: {
            session_id: sessionId,
            screen_sharing: {
              active: !computerState.screen_sharing.active,
              userId: sessionId
            }
          }
        }
      });

      if (error) throw error;

      toast({
        title: computerState.screen_sharing.active ? "Screen sharing stopped" : "Screen sharing started",
        description: `High performance mode: 4K @ 60fps`,
      });
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle screen sharing",
      });
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-0">
        <div className="relative w-full h-[800px] rounded-xl overflow-hidden">
          {/* Main view - High Performance Browser */}
          <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm">
            <div className="w-full h-12 bg-gray-900/90 border-b border-gray-700 flex items-center px-4 gap-4">
              <Globe className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">{computerState.browser_state?.url}</span>
              <div className="ml-auto flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-400" />
                <span className="text-green-400">Claude Active</span>
              </div>
            </div>
            <iframe 
              src="about:blank"
              className="w-full h-[calc(100%-3rem)]"
              style={{ 
                backgroundColor: 'transparent',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            />
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
                  <span className="text-blue-400">{computerState.system_metrics.cpu.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">Memory</span>
                  <span className="text-purple-400">{computerState.system_metrics.memory.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-400">Network</span>
                  <span className="text-green-400">{computerState.system_metrics.network.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800/90 px-6 py-3 rounded-full border border-gray-700/50 backdrop-blur-xl">
            <Button
              variant="ghost"
              className={`${computerState.screen_sharing.active ? 'text-green-400' : 'text-gray-400'} hover:text-green-300`}
              onClick={toggleSharing}
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