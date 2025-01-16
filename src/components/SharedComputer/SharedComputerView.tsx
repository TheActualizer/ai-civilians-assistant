import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Camera, Monitor, Users } from 'lucide-react';

interface SharedComputerProps {
  sessionId?: string;
}

export function SharedComputerView({ sessionId }: SharedComputerProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      console.log('No session ID provided, cannot initialize shared computer view');
      return;
    }

    console.log('Initializing shared computer view:', { sessionId });

    // Subscribe to session updates
    const channel = supabase
      .channel(`shared_computer_${sessionId}`)
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const state = channel.presenceState();
          console.log('Presence state updated:', state);
          setActiveUsers(Object.keys(state));
        }
      )
      .on(
        'presence',
        { event: 'join' },
        ({ key }) => {
          console.log('User joined:', key);
          toast({
            title: "New user joined",
            description: `User ${key} joined the session`,
          });
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to updates');
          setIsConnected(true);
          
          // Track our presence
          await channel.track({
            user_id: sessionId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      console.log('Cleaning up shared computer subscriptions');
      supabase.removeChannel(channel);
    };
  }, [sessionId, toast]);

  const toggleSharing = async () => {
    console.log('Toggling screen sharing:', { currentState: isSharing });
    try {
      const { data, error } = await supabase.functions.invoke('shared-computer', {
        body: {
          action: 'update_state',
          data: {
            session_id: sessionId,
            state: {
              screenSharing: {
                active: !isSharing,
                userId: sessionId
              }
            }
          }
        }
      });

      if (error) {
        console.error('Error toggling screen share:', error);
        throw error;
      }

      console.log('Screen sharing toggle successful:', data);
      setIsSharing(!isSharing);
      toast({
        title: isSharing ? "Screen sharing stopped" : "Screen sharing started",
        description: isSharing ? "Your screen is no longer being shared" : "Your screen is now being shared",
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

  const toggleMicrophone = async () => {
    console.log('Toggling microphone:', { currentState: isMicActive });
    try {
      const { data, error } = await supabase.functions.invoke('shared-computer', {
        body: {
          action: 'update_state',
          data: {
            session_id: sessionId,
            state: {
              voiceChat: {
                active: !isMicActive,
                userId: sessionId
              }
            }
          }
        }
      });

      if (error) throw error;
      
      console.log('Microphone toggle successful:', data);
      setIsMicActive(!isMicActive);
      toast({
        title: isMicActive ? "Microphone disabled" : "Microphone enabled",
        description: isMicActive ? "Your microphone is now muted" : "Your microphone is now active",
      });
    } catch (error) {
      console.error('Error toggling microphone:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle microphone",
      });
    }
  };

  const toggleCamera = async () => {
    console.log('Toggling camera:', { currentState: isCameraActive });
    try {
      const { data, error } = await supabase.functions.invoke('shared-computer', {
        body: {
          action: 'update_state',
          data: {
            session_id: sessionId,
            state: {
              videoChat: {
                active: !isCameraActive,
                userId: sessionId
              }
            }
          }
        }
      });

      if (error) throw error;
      
      console.log('Camera toggle successful:', data);
      setIsCameraActive(!isCameraActive);
      toast({
        title: isCameraActive ? "Camera disabled" : "Camera enabled",
        description: isCameraActive ? "Your camera is now off" : "Your camera is now on",
      });
    } catch (error) {
      console.error('Error toggling camera:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle camera",
      });
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-0">
        <div className="relative w-full h-[800px] rounded-xl overflow-hidden">
          {/* Main view */}
          <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm">
            <iframe 
              src="about:blank"
              className="w-full h-full"
              style={{ 
                backgroundColor: 'transparent',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            />
          </div>

          {/* Controls overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800/90 px-6 py-3 rounded-full border border-gray-700/50 backdrop-blur-xl">
            <Button
              variant="ghost"
              className={`${isSharing ? 'text-green-400' : 'text-gray-400'} hover:text-green-300`}
              onClick={toggleSharing}
            >
              <Monitor className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`${isCameraActive ? 'text-blue-400' : 'text-gray-400'} hover:text-blue-300`}
              onClick={toggleCamera}
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`${isMicActive ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-300`}
              onClick={toggleMicrophone}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700/50 rounded-full">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">{activeUsers.length}</span>
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