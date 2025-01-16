import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { Monitor, Users, Video, Mic, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { SharedComputerState } from '@/types/agent';

export function SharedComputerView() {
  const session = useSession();
  const { toast } = useToast();
  const [state, setState] = useState<SharedComputerState>({
    screen_sharing: {
      active: false,
      userId: null,
    },
    voice_chat: {
      active: false,
      participants: [],
    },
    video_chat: {
      active: false,
      participants: [],
    },
    active_users: [],
    system_metrics: {
      cpu: 0,
      memory: 0,
      network: 0,
    },
    browser_state: {
      url: window.location.href,
      title: document.title,
      isClaudeActive: false,
      lastInteraction: new Date().toISOString(),
    },
  });

  useEffect(() => {
    const channel = supabase.channel('shared_computer')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        console.log('Presence state updated:', newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', newPresences);
        toast({
          title: 'User Joined',
          description: `A new user has joined the shared computer session`,
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: session?.user?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [session, toast]);

  const toggleScreenSharing = async () => {
    try {
      const newState = {
        ...state,
        screen_sharing: {
          active: !state.screen_sharing.active,
          userId: session?.user?.id || null,
        },
      };
      
      await supabase
        .from('shared_computer_sessions')
        .upsert({ 
          session_id: 'main',
          screen_sharing: newState.screen_sharing,
        });
      
      setState(newState);
      
      toast({
        title: state.screen_sharing.active ? 'Screen Sharing Stopped' : 'Screen Sharing Started',
        description: state.screen_sharing.active ? 'You have stopped sharing your screen' : 'You are now sharing your screen',
      });
    } catch (error) {
      console.error('Error toggling screen sharing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle screen sharing",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Shared Computer</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={state.screen_sharing.active ? "destructive" : "default"}
              onClick={toggleScreenSharing}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              {state.screen_sharing.active ? "Stop Sharing" : "Share Screen"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.active_users.map((userId, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{userId}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                System Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">CPU Usage</div>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${state.system_metrics.cpu}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Memory Usage</div>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${state.system_metrics.memory}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Network Usage</div>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${state.system_metrics.network}%` }} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}