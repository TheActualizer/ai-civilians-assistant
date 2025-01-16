import { useState, useEffect } from 'react';
import { AlertCircle, Brain, Network, Cpu, RotateCw, Play, Pause, Terminal } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
  const [commandInput, setCommandInput] = useState('');
  const [systemHealth, setSystemHealth] = useState({
    claudeStatus: 'idle',
    geminiStatus: 'idle',
    proStatus: 'idle',
    syncStatus: 'pending'
  });

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
        .maybeSingle();

      if (error) throw error;

      console.log('Page analysis initialized:', existingAnalysis);
      
      toast({
        title: "Command Center Activated",
        description: "Claude is now ready to receive strategic directives.",
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
              title: "Quantum Thread Connected! 🎯",
              description: `System Evolution Score: ${payload.new.connection_score}`,
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
      const interval = window.setInterval(startClaudeAnalysis, 20000);
      setAnalysisInterval(interval);
      console.log('Started automated system evolution loop');
      
      toast({
        title: "Auto-Evolution Active",
        description: "Claude will continuously analyze and improve system connections.",
      });
    } else if (!autoAnalysis && analysisInterval) {
      window.clearInterval(analysisInterval);
      setAnalysisInterval(null);
      console.log('Paused system evolution loop');
    }

    return () => {
      if (analysisInterval) {
        window.clearInterval(analysisInterval);
      }
    };
  }, [autoAnalysis]);

  const handleCommandSubmit = async () => {
    if (!commandInput.trim()) return;
    
    console.log('Processing strategic command:', commandInput);
    setIsAnalyzing(true);
    
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('claude-compute', {
        body: {
          messages: [{ 
            role: 'user', 
            content: commandInput 
          }],
          systemPrompt: `You are the Chief Technology Officer of a trillion-dollar tech company.
                        Your mission is to analyze and improve the system by:
                        1. Identifying optimization opportunities
                        2. Coordinating with Gemini and Pro-01 agents
                        3. Implementing strategic improvements
                        4. Maintaining system integrity
                        
                        Current evolution phase: ${analysisCount + 1}
                        Previous insights: ${JSON.stringify(threadAnalysis?.analysis_data || {})}`,
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
            timestamp: new Date().toISOString(),
            command: commandInput
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
      setCommandInput('');
      
      toast({
        title: "Strategic Directive Processed",
        description: `System evolution phase ${analysisCount + 1} completed.`,
      });

      setSystemHealth(prev => ({
        ...prev,
        claudeStatus: 'completed',
        syncStatus: 'synced'
      }));

    } catch (error) {
      console.error('Error processing command:', error);
      toast({
        variant: "destructive",
        title: "Command Processing Error",
        description: "Failed to execute strategic directive.",
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

  const startClaudeAnalysis = async () => {
    console.log('Initiating system evolution phase:', analysisCount + 1);
    await handleCommandSubmit();
  };

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-200">System Command Center</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setAutoAnalysis(!autoAnalysis)}
              className={autoAnalysis ? 'bg-green-500/20 border-green-500' : ''}
            >
              {autoAnalysis ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Evolution
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume Evolution
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Strategic Command Input</label>
            <div className="flex gap-2">
              <Textarea
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Enter strategic directive for Claude..."
                className="flex-1"
              />
              <Button 
                onClick={handleCommandSubmit}
                disabled={isAnalyzing}
                className="self-start"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Terminal className="h-4 w-4 mr-2" />
                    Execute
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
      </div>
    </ScrollArea>
  );
}
