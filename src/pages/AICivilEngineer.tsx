import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Brain } from 'lucide-react';
import Navbar from "@/components/Navbar";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";
import { AgentsPanel } from "@/components/Agents/AgentsPanel";
import { ServiceMonitor } from "@/components/Enterprise/ServiceMonitor";
import { ApiMetricsPanel } from "@/components/Enterprise/ApiMetricsPanel";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { AgentMessage } from '@/types/agent';

const AICivilEngineer = () => {
  const session = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionScore, setConnectionScore] = useState(0);
  const [portalEnergy, setPortalEnergy] = useState(0);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);

  useEffect(() => {
    console.log('AICivilEngineer: Initializing portal connections...');

    const initializeThreadConnections = async () => {
      if (!session?.user?.id) return;

      try {
        const { data: connectionData, error: connectionError } = await supabase
          .from('auth_thread_connections')
          .insert({
            user_id: session.user.id,
            connection_type: 'ai_civil_engineer',
            connection_status: 'active',
            metadata: {
              entry_point: 'portal_nexus',
              session_start: new Date().toISOString(),
              portal_state: 'initializing'
            }
          })
          .select()
          .single();

        if (connectionError) throw connectionError;

        console.log('Portal connection initialized:', connectionData);
        setConnectionScore(connectionData.connection_score || 0);
        
        const energyInterval = setInterval(() => {
          setPortalEnergy(prev => Math.min(prev + 0.5, 100));
        }, 1000);

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
              console.log('Portal connection update:', payload);
              setConnectionScore(payload.new.connection_score);
            }
          )
          .subscribe();

        return () => {
          clearInterval(energyInterval);
          supabase.removeChannel(channel);
        };
      } catch (error: any) {
        console.error('Error initializing portal connections:', error);
        toast({
          variant: "destructive",
          title: "Portal Disruption",
          description: "Failed to establish quantum thread connections"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeThreadConnections();
  }, [session, toast]);

  const handleAgentMessage = async (message: string, agent: string) => {
    console.log(`Portal: Agent ${agent} transmitted message:`, message);
    
    setAgentMessages(prev => [...prev, {
      agent,
      message,
      timestamp: new Date().toISOString()
    }]);

    if (session?.user?.id) {
      await supabase
        .from('auth_thread_connections')
        .update({
          connection_status: 'quantum_linked',
          metadata: {
            last_agent: agent,
            last_interaction: new Date().toISOString(),
            portal_state: 'active'
          }
        })
        .eq('user_id', session.user.id)
        .eq('connection_type', 'ai_civil_engineer');
    }

    toast({
      title: `Quantum Echo from ${agent}`,
      description: message,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-800">
      <Navbar session={session} />
      
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {connectionScore > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 text-white font-semibold">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  <span>Portal Mastery Level: {connectionScore}</span>
                  <div className="ml-2 h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                      style={{ width: `${portalEnergy}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
                  <Brain className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-200">Active Neural Links: {agentMessages.length}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AgentsPanel
                onMessage={handleAgentMessage}
                onVoiceInput={(transcript) => handleAgentMessage(transcript, 'Quantum Voice Interface')}
                messages={agentMessages}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ServiceMonitor />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ApiMetricsPanel />
            </motion.div>
          </div>
          
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <DebugPanel
                isLoading={isLoading}
                error={error}
                requestId={null}
                lightboxData={null}
                apiError={null}
                apiCallHistory={[]}
                onRetry={() => setIsLoading(true)}
                onMessageSubmit={(message) => {
                  if (message.trim()) {
                    handleAgentMessage(message, 'Debug Console');
                  }
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICivilEngineer;