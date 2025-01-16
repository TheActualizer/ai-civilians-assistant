import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";
import { VersionSwitcher } from "@/components/VersionSwitcher/VersionSwitcher";
import { VersionSelector } from "@/components/VersionManagement/VersionSelector";
import { AgentsPanel } from "@/components/Agents/AgentsPanel";
import { AgentMetrics } from "@/components/Agents/AgentMetrics";
import { AgentNetwork } from "@/components/Agents/AgentNetwork";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { AgentMessage } from '@/types/agent';

const AICivilEngineer = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [connectionScore, setConnectionScore] = useState(0);
  const [apiCallHistory, setApiCallHistory] = useState<Array<{
    timestamp: string;
    event: string;
    details?: any;
  }>>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);

  useEffect(() => {
    console.log('AICivilEngineer: Component mounted, initializing thread connections...');

    const initializeThreadConnections = async () => {
      if (!session?.user?.id) return;

      try {
        // Create initial thread connection
        const { data: connectionData, error: connectionError } = await supabase
          .from('auth_thread_connections')
          .insert({
            user_id: session.user.id,
            connection_type: 'ai_civil_engineer',
            connection_status: 'active',
            metadata: {
              entry_point: 'ai_civil_engineer',
              session_start: new Date().toISOString()
            }
          })
          .select()
          .single();

        if (connectionError) throw connectionError;

        console.log('Thread connection initialized:', connectionData);
        setConnectionScore(connectionData.connection_score || 0);

        // Subscribe to connection updates
        const channel = supabase
          .channel('thread-connections')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'auth_thread_connections',
              filter: `user_id=eq.${session.user.id}`
            },
            (payload) => {
              console.log('Connection update received:', payload);
              setConnectionScore(payload.new.connection_score);
              
              // Show achievement toast for score milestones
              if (payload.new.connection_score % 5 === 0) {
                toast({
                  title: "Achievement Unlocked! 🎉",
                  description: `Connection Level ${payload.new.connection_score} Reached!`,
                });
              }
            }
          )
          .subscribe();

        return () => {
          console.log('Cleaning up thread connection subscriptions');
          supabase.removeChannel(channel);
        };
      } catch (error: any) {
        console.error('Error initializing thread connections:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to initialize thread connections"
        });
      }
    };

    const fetchInitialData = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const { data, error } = await supabase
          .from('property_assessments')
          .select('*')
          .order('created_at', { ascending: false })
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setRequestId(data.id);
          // Update connection metadata with property context
          if (session?.user?.id) {
            await supabase
              .from('auth_thread_connections')
              .update({
                metadata: {
                  property_context: data.id,
                  last_activity: new Date().toISOString()
                }
              })
              .eq('user_id', session.user.id)
              .eq('connection_type', 'ai_civil_engineer');
          }
        }
      } catch (error: any) {
        console.error('Error in fetchInitialData:', error);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load initial data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeThreadConnections();
    fetchInitialData();
  }, [session, toast]);

  const handleAgentMessage = async (message: string, agent: string) => {
    console.log(`AICivilEngineer: Agent ${agent} received message:`, message);
    
    setAgentMessages(prev => [...prev, {
      agent,
      message,
      timestamp: new Date().toISOString()
    }]);

    // Update connection status on agent interaction
    if (session?.user?.id) {
      await supabase
        .from('auth_thread_connections')
        .update({
          connection_status: 'interacting',
          metadata: {
            last_agent: agent,
            last_interaction: new Date().toISOString()
          }
        })
        .eq('user_id', session.user.id)
        .eq('connection_type', 'ai_civil_engineer');
    }

    toast({
      title: `Message from ${agent}`,
      description: message,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <div className="container mx-auto px-4 py-8">
        {connectionScore > 0 && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">
              Connection Level: {connectionScore} 🌟
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VersionSelector />
            <div className="mt-8">
              <AgentsPanel
                onMessage={handleAgentMessage}
                onVoiceInput={(transcript) => handleAgentMessage(transcript, 'Voice Assistant')}
                messages={agentMessages}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <AgentMetrics />
              <AgentNetwork />
            </div>
          </div>
          <div className="space-y-8">
            <VersionSwitcher />
            <DebugPanel
              isLoading={isLoading}
              error={error}
              requestId={requestId}
              lightboxData={null}
              apiError={null}
              apiCallHistory={apiCallHistory}
              onRetry={() => setIsLoading(true)}
              onMessageSubmit={(message) => {
                if (message.trim()) {
                  setApiCallHistory(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    event: "User message",
                    details: { message }
                  }]);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICivilEngineer;