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
  const [apiCallHistory, setApiCallHistory] = useState<Array<{
    timestamp: string;
    event: string;
    details?: any;
  }>>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);

  useEffect(() => {
    console.log('AICivilEngineer: Component mounted, session status:', session ? 'Active' : 'None');

    const fetchInitialData = async () => {
      console.log('AICivilEngineer: Fetching initial data...');
      try {
        // Log the current session state
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        console.log('AICivilEngineer: Current session:', currentSession ? 'Active' : 'None');

        // Fetch property assessment data
        const { data, error } = await supabase
          .from('property_assessments')
          .select('*')
          .order('created_at', { ascending: false })
          .maybeSingle();

        if (error) {
          console.error('AICivilEngineer: Error fetching property assessment:', error);
          throw error;
        }

        if (data) {
          console.log('AICivilEngineer: Fetched property assessment:', data);
          setRequestId(data.id);
        } else {
          console.log('AICivilEngineer: No property assessment found');
        }
        
      } catch (error: any) {
        console.error('AICivilEngineer: Error in fetchInitialData:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchInitialData();
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel('ai-civil-engineer')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_assessments'
        },
        (payload) => {
          console.log('AICivilEngineer: Real-time update received:', payload);
          // Handle real-time updates here
        }
      )
      .subscribe(status => {
        console.log('AICivilEngineer: Real-time subscription status:', status);
      });

    return () => {
      console.log('AICivilEngineer: Cleaning up subscriptions');
      supabase.removeChannel(channel);
    };
  }, [session, toast]);

  const handleAgentMessage = async (message: string, agent: string) => {
    console.log(`AICivilEngineer: Agent ${agent} received message:`, message);
    
    setAgentMessages(prev => [...prev, {
      agent,
      message,
      timestamp: new Date().toISOString()
    }]);

    toast({
      title: `Message from ${agent}`,
      description: message,
    });
  };

  const handleMessageSubmit = async (message: string) => {
    if (message.trim()) {
      console.log('AICivilEngineer: Submitting message:', message);
      setApiCallHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        event: "User message",
        details: { message }
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <div className="container mx-auto px-4 py-8">
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
              onMessageSubmit={handleMessageSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICivilEngineer;