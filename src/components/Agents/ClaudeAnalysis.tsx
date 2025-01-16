import { useState, useEffect } from 'react';
import { AlertCircle, Brain, Network, Cpu, RotateCw, Play, Pause } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClaudeAnalysisProps {
  pageRoute: string;
  agentState: any;
}

export function ClaudeAnalysis({ pageRoute, agentState }: ClaudeAnalysisProps) {
  const { toast } = useToast();
  const [threadAnalysis, setThreadAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [analysisInterval, setAnalysisInterval] = useState<number | null>(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [systemHealth, setSystemHealth] = useState({
    claudeStatus: 'idle',
    geminiStatus: 'idle',
    proStatus: 'idle',
    syncStatus: 'pending'
  });

  // Start analysis immediately when component mounts
  useEffect(() => {
    console.log('Initializing immediate analysis and continuous improvement...');
    startClaudeAnalysis();
    initializePageAnalysis();
  }, []);

  const initializePageAnalysis = async () => {
    console.log('Setting up continuous page analysis for:', pageRoute);
    try {
      const { data: existingAnalysis, error } = await supabase
        .from('debug_thread_analysis')
        .update({
          auto_analysis_enabled: true,
          analysis_frequency: 20,
          analysis_status: 'active',
          analysis_data: {
            ...threadAnalysis?.analysis_data,
            continuous_improvement: true,
            target_pages: ['/', '/learn-more', '/ai-civil-engineer'],
            improvement_focus: [
              'UI/UX optimization',
              'Component structure',
              'Performance metrics',
              'User engagement'
            ]
          }
        })
        .eq('page_path', pageRoute)
        .select()
        .single();

      if (error) throw error;

      console.log('Page analysis initialized:', existingAnalysis);
      
      toast({
        title: "Continuous Improvement Activated",
        description: "Claude will now actively analyze and suggest improvements for all pages.",
      });
    } catch (error) {
      console.error('Error initializing page analysis:', error);
    }
  };

  useEffect(() => {
    console.log('Initializing thread analysis subscription...');
    const channel = supabase
      .channel('thread-analysis')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'debug_thread_analysis',
          filter: `page_path=eq.${pageRoute}`
        },
        (payload) => {
          console.log('Thread analysis update:', payload);
          setThreadAnalysis(payload.new);
          
          if (payload.new.connection_score > (payload.old?.connection_score || 0)) {
            toast({
              title: "Thread Connection Achievement! 🎯",
              description: `New connection score: ${payload.new.connection_score}`,
            });
          }

          setSystemHealth(prev => ({
            ...prev,
            claudeStatus: 'active',
            syncStatus: 'syncing'
          }));
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up thread analysis subscription');
      supabase.removeChannel(channel);
    };
  }, [pageRoute, toast]);

  useEffect(() => {
    if (autoAnalysis && !analysisInterval) {
      const interval = window.setInterval(startClaudeAnalysis, 20000); // Run every 20 seconds for rapid iteration
      setAnalysisInterval(interval);
      console.log('Started automated Claude analysis loop');
      
      toast({
        title: "Auto Analysis Active",
        description: "Claude will continuously analyze and improve thread connections.",
      });
    } else if (!autoAnalysis && analysisInterval) {
      window.clearInterval(analysisInterval);
      setAnalysisInterval(null);
      console.log('Stopped automated Claude analysis');
    }

    return () => {
      if (analysisInterval) {
        window.clearInterval(analysisInterval);
      }
    };
  }, [autoAnalysis]);

  const startClaudeAnalysis = async () => {
    console.log('Starting Claude analysis iteration:', analysisCount + 1);
    setIsAnalyzing(true);
    
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('claude-compute', {
        body: {
          messages: [{ 
            role: 'user', 
            content: 'Analyze the current system state, identify improvements, and coordinate with other agents to implement changes.' 
          }],
          systemPrompt: `You are an expert system analyzer and improver working with Gemini and Pro-01 agents.
                        Your goal is to continuously improve the application by:
                        1. Identifying UI/UX improvements
                        2. Suggesting new features and optimizations
                        3. Coordinating with other agents to implement changes
                        4. Maintaining system health and performance
                        
                        Current analysis iteration: ${analysisCount + 1}
                        Previous findings: ${JSON.stringify(threadAnalysis?.analysis_data || {})}`,
          pageContext: {
            route: pageRoute,
            agents: agentState.agents,
            actions: agentState.actions,
            systemHealth: systemHealth
          }
        }
      });

      if (error) throw error;

      const { data: threadUpdate, error: updateError } = await supabase
        .from('debug_thread_analysis')
        .upsert({
          page_path: pageRoute,
          thread_type: 'claude-analysis',
          analysis_data: {
            ...analysisData,
            iteration: analysisCount + 1,
            timestamp: new Date().toISOString()
          },
          analysis_status: 'completed',
          last_analysis_timestamp: new Date().toISOString(),
          auto_analysis_enabled: true,
          analysis_interval: 20000
        })
        .select()
        .single();

      if (updateError) throw updateError;

      setThreadAnalysis(threadUpdate);
      setAnalysisCount(prev => prev + 1);
      
      toast({
        title: "Analysis Complete",
        description: `Iteration ${analysisCount + 1} completed successfully.`,
      });

      setSystemHealth(prev => ({
        ...prev,
        claudeStatus: 'completed',
        syncStatus: 'synced'
      }));

    } catch (error) {
      console.error('Error in Claude analysis:', error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to complete Claude analysis iteration.",
      });
      
      setSystemHealth(prev => ({
        ...prev,
        claudeStatus: 'error',
        syncStatus: 'error'
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-200">AI System Analysis</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setAutoAnalysis(!autoAnalysis)}
              className={autoAnalysis ? 'bg-green-500/20 border-green-500' : ''}
            >
              {autoAnalysis ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Auto Analysis
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Auto Analysis
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={startClaudeAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Run Analysis Now
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-300">Claude</span>
            </div>
            <Badge variant="outline" className={`
              ${systemHealth.claudeStatus === 'active' && 'bg-green-500/10 text-green-400'}
              ${systemHealth.claudeStatus === 'error' && 'bg-red-500/10 text-red-400'}
              ${systemHealth.claudeStatus === 'idle' && 'bg-gray-500/10 text-gray-400'}
            `}>
              {systemHealth.claudeStatus}
            </Badge>
          </div>

          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">Gemini</span>
            </div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
              {systemHealth.geminiStatus}
            </Badge>
          </div>

          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Network className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Pro-01</span>
            </div>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
              {systemHealth.proStatus}
            </Badge>
          </div>

          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Sync Status</span>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-400">
              {systemHealth.syncStatus}
            </Badge>
          </div>
        </div>

        {threadAnalysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                Score: {threadAnalysis.connection_score}
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                Status: {threadAnalysis.analysis_status}
              </Badge>
              {autoAnalysis && (
                <Badge variant="outline" className="bg-green-500/10 text-green-400">
                  Auto Analysis Active
                </Badge>
              )}
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-medium text-gray-300 mb-2">Analysis Progress</h4>
              <Progress value={analysisCount * 10} className="h-2" />
              <p className="text-sm text-gray-400 mt-2">
                Completed Iterations: {analysisCount}
              </p>
            </div>

            {threadAnalysis.analysis_data && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">Analysis Results</h4>
                <pre className="p-4 bg-gray-800/50 rounded-lg overflow-x-auto text-sm text-gray-300">
                  {JSON.stringify(threadAnalysis.analysis_data, null, 2)}
                </pre>
              </div>
            )}

            {threadAnalysis.suggested_connections?.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">Suggested Connections</h4>
                <div className="grid gap-2">
                  {threadAnalysis.suggested_connections.map((connection: any, index: number) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                    >
                      <p className="text-sm text-gray-300">{connection.description}</p>
                      {connection.score && (
                        <Badge className="mt-2" variant="outline">
                          Score: {connection.score}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}