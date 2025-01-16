import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";
import { AgentMetrics } from "@/components/Agents/AgentMetrics";
import { AgentNetwork } from "@/components/Agents/AgentNetwork";
import { AgentsPanel } from "@/components/Agents/AgentsPanel";
import { supabase } from "@/integrations/supabase/client";
import { agentMonitoringService } from "@/services/agent-monitoring/AgentMonitoringService";
import { debugVisualizationService } from "@/services/debug/DebugVisualizationService";
import { analyticsService } from "@/services/analytics/AnalyticsService";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const AgentMonitoring = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiCallHistory, setApiCallHistory] = useState<Array<{
    timestamp: string;
    event: string;
    details?: any;
  }>>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [verificationResults, setVerificationResults] = useState<Array<{
    metric: string;
    value: number;
    timestamp: string;
    isVerified: boolean;
    source: string;
  }>>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    console.log('Initializing agent monitoring...');
    
    const initializeServices = async () => {
      try {
        setIsInitializing(true);
        
        // Initialize monitoring channels
        const agentChannel = supabase
          .channel('agent-monitoring')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'agent_interactions'
            },
            (payload) => {
              console.log('Agent interaction update:', payload);
              logSystemEvent('agent_interaction', payload);
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'debug_agent_monitoring'
            },
            (payload) => {
              console.log('Agent monitoring update:', payload);
              logSystemEvent('agent_monitoring', payload);
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'system_events'
            },
            (payload) => {
              console.log('System event:', payload);
              logSystemEvent('system_event', payload);
            }
          )
          .subscribe(status => {
            console.log('Agent monitoring subscription status:', status);
          });

        // Initialize visualization service
        await debugVisualizationService.initialize({
          type: 'network',
          mode: 'artistic',
          theme: 'dark',
          animations: true
        });

        // Track page view
        await analyticsService.trackMetric({
          metric_type: 'page_view',
          value: 1,
          metadata: { page: 'agent-monitoring' }
        });

        toast({
          title: "Monitoring Active",
          description: "Real-time agent monitoring system initialized",
        });
      } catch (error) {
        console.error('Error initializing services:', error);
        toast({
          variant: "destructive",
          title: "Initialization Error",
          description: "Failed to initialize monitoring services",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeServices();

    return () => {
      console.log('Cleaning up agent monitoring...');
      supabase.removeAllChannels();
    };
  }, [toast]);

  const logSystemEvent = async (type: string, details: any) => {
    try {
      await agentMonitoringService.logAgentAction('system', type, details);
      setApiCallHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        event: `System event: ${type}`,
        details
      }]);
    } catch (error) {
      console.error('Error logging system event:', error);
    }
  };

  const handleMessageSubmit = async (message: string) => {
    try {
      await agentMonitoringService.logAgentAction('debug-console', 'message-sent', { message });
      setApiCallHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        event: "User message",
        details: { message }
      }]);
    } catch (error) {
      console.error('Error handling message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    }
  };

  const verifyMetricsAgainstLogs = async () => {
    setIsVerifying(true);
    try {
      // Fetch recent metrics from Supabase
      const { data: metricsData, error: metricsError } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (metricsError) throw metricsError;

      // Get displayed metrics from the DOM
      const displayedMetrics = document.querySelectorAll('[data-metric-value]');
      const results = [];

      for (const element of displayedMetrics) {
        const metricName = element.getAttribute('data-metric-name');
        const displayedValue = parseFloat(element.getAttribute('data-metric-value') || '0');

        // Find corresponding value in Supabase data
        const matchingMetric = metricsData.find(m => {
          const value = m[metricName as keyof typeof m];
          return typeof value === 'number' && Math.abs(value - displayedValue) < 0.1;
        });

        results.push({
          metric: metricName || 'unknown',
          value: displayedValue,
          timestamp: matchingMetric?.created_at || new Date().toISOString(),
          isVerified: !!matchingMetric,
          source: matchingMetric ? 'Supabase agent_metrics table' : 'UI Display'
        });
      }

      setVerificationResults(results);
      
      toast({
        title: "Verification Complete",
        description: `Verified ${results.filter(r => r.isVerified).length} out of ${results.length} metrics`,
      });
    } catch (error) {
      console.error('Error verifying metrics:', error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Could not verify metrics against database logs",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <div className="flex w-full min-h-[calc(100vh-4rem)]">
        <DebugPanel
          isLoading={false}
          error={null}
          requestId={null}
          lightboxData={null}
          apiCallHistory={apiCallHistory}
          apiError={null}
          onRetry={() => {}}
          onMessageSubmit={handleMessageSubmit}
        />
        
        <div className="flex-1 container mx-auto px-4 py-8 pt-20">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => navigate('/ai-civil-engineer')}
              variant="outline"
              className="gap-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to AI Civil Engineer
            </Button>
            <h1 className="text-2xl font-bold text-white">Advanced Agent Monitoring</h1>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  onClick={verifyMetricsAgainstLogs}
                  variant="outline"
                  className="gap-2"
                  disabled={isVerifying}
                >
                  <Database className="h-4 w-4" />
                  {isVerifying ? 'Verifying...' : 'Verify Metrics'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-gray-900 text-gray-100">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Metrics Verification Results
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] mt-4">
                  <div className="space-y-4">
                    {verificationResults.map((result, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                          result.isVerified 
                            ? 'border-green-500/30 bg-green-500/10' 
                            : 'border-red-500/30 bg-red-500/10'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{result.metric}</h4>
                            <p className="text-sm text-gray-400">Value: {result.value}</p>
                            <p className="text-sm text-gray-400">Source: {result.source}</p>
                          </div>
                          <span className={`text-sm ${
                            result.isVerified ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {result.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AgentMetrics />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AgentNetwork />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AgentsPanel 
                onMessage={async (message: string, agent: string) => {
                  await agentMonitoringService.logAgentAction(agent, 'message-received', { message });
                  setApiCallHistory(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    event: `Agent ${agent} message`,
                    details: { message }
                  }]);
                }}
                onVoiceInput={async (transcript: string) => {
                  await agentMonitoringService.logAgentAction('voice-input', 'transcript-received', { transcript });
                  setApiCallHistory(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    event: "Voice input received",
                    details: { transcript }
                  }]);
                }}
                messages={[]}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentMonitoring;