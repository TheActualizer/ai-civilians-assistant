import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { AgentsPanel } from "@/components/Agents/AgentsPanel";
import { AgentMetrics } from "@/components/Agents/AgentMetrics";
import { AgentNetwork } from "@/components/Agents/AgentNetwork";
import { Skeleton } from "@/components/ui/skeleton";
import type { AgentMessage } from '@/types/agent';

const Assessment = () => {
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

  const handleAgentMessage = async (message: string, agent: string) => {
    console.log(`Agent ${agent} received message:`, message);
    
    setAgentMessages(prev => [...prev, {
      agent,
      message,
      timestamp: new Date().toISOString()
    }]);

    toast({
      title: `Message from ${agent}`,
      description: message,
    });

    addToHistory(`Agent interaction: ${agent}`, { message });
  };

  const handleVoiceInput = async (transcript: string) => {
    console.log('Voice input received:', transcript);
    addToHistory('Voice input received', { transcript });
    await handleAgentMessage(transcript, 'Assessment Agent');
  };

  const addToHistory = (event: string, details?: any) => {
    console.log(`API Event: ${event}`, details);
    setApiCallHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      event,
      details
    }]);
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    addToHistory("Retrying API call");
    await fetchInitialData();
  };

  const handleMessageSubmit = (message: string) => {
    if (message.trim()) {
      addToHistory("User message", { message });
      toast({
        title: "Message sent",
        description: "Your message has been logged for debugging purposes",
      });
    }
  };

  const fetchInitialData = async () => {
    try {
      const { data: assessmentData, error: fetchError } = await supabase
        .from('property_assessments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        console.error('Error fetching assessment:', fetchError);
        setError('Failed to fetch assessment data');
        return;
      }

      setRequestId(assessmentData.id);
      addToHistory("Initial assessment data fetched", assessmentData);

    } catch (error: any) {
      console.error('Error in fetchInitialData:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Navbar session={session} />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <div className="container mx-auto px-4 py-8">
        <DebugPanel
          isLoading={isLoading}
          error={error}
          requestId={requestId}
          lightboxData={null}
          apiError={null}
          apiCallHistory={apiCallHistory}
          onRetry={handleRetry}
          onMessageSubmit={handleMessageSubmit}
        />

        <div className="flex flex-col space-y-8 mt-8">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => navigate('/ai-civil-engineer')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to AI Civil Engineer
            </Button>

            <Button
              onClick={() => navigate('/zoning')}
              className="gap-2"
            >
              {isMobile ? 'Next' : 'Continue to Zoning Analysis'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <AgentsPanel
            onMessage={handleAgentMessage}
            onVoiceInput={handleVoiceInput}
            messages={agentMessages}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AgentMetrics />
            <AgentNetwork />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;