import { useState, useEffect } from 'react';
import { AlertCircle, Brain, Network, Cpu, RotateCw, Play, Pause, Terminal, MousePointer, Send, Power, Activity } from 'lucide-react';
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
  const [showInstructions, setShowInstructions] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    claudeStatus: 'connecting',
    geminiStatus: 'idle',
    proStatus: 'idle',
    syncStatus: 'pending'
  });
  const [isConnected, setIsConnected] = useState(false);

  const startClaudeAnalysis = async () => {
    if (isAnalyzing) return;
    
    console.log('Starting Claude analysis...');
    setIsAnalyzing(true);
    
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('claude-compute', {
        body: {
          messages: [{ 
            role: 'user', 
            content: 'Analyze current system state and suggest improvements' 
          }],
          systemPrompt: `You are analyzing the system state for route: ${pageRoute}
                        Current evolution phase: ${analysisCount + 1}
                        Previous insights: ${JSON.stringify(threadAnalysis?.analysis_data || {})}`
        }
      });

      if (error) throw error;

      console.log('Claude analysis response:', analysisData);

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
          last_analysis_timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (updateError) throw updateError;

      setThreadAnalysis(threadUpdate);
      setAnalysisCount(prev => prev + 1);
      
      toast({
        title: "Analysis Complete",
        description: `System evolution phase ${analysisCount + 1} completed.`,
      });

      setSystemHealth(prev => ({
        ...prev,
        claudeStatus: 'active',
        syncStatus: 'synced'
      }));

    } catch (error) {
      console.error('Error in Claude analysis:', error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to complete system analysis.",
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

  useEffect(() => {
    console.log('Initializing Claude system...');
    
    let retryCount = 0;
    const maxRetries = 3;

    const initSystem = async () => {
      try {
        setSystemHealth(prev => ({ ...prev, claudeStatus: 'connecting' }));
        
        const { data: existingAnalysis, error: fetchError } = await supabase
          .from('debug_thread_analysis')
          .select('*')
          .eq('page_path', pageRoute)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existingAnalysis) {
          console.log('No existing analysis found, creating new one...');
          const { data: newAnalysis, error: insertError } = await supabase
            .from('debug_thread_analysis')
            .insert({
              page_path: pageRoute,
              thread_type: 'claude-analysis',
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
            .select()
            .single();

          if (insertError) throw insertError;
          setThreadAnalysis(newAnalysis);
          setIsConnected(true);
          
          toast({
            title: "Claude System Initialized",
            description: "New analysis thread created successfully.",
          });
        } else {
          console.log('Existing analysis found, updating...');
          const { data: updatedAnalysis, error: updateError } = await supabase
            .from('debug_thread_analysis')
            .update({
              auto_analysis_enabled: true,
              analysis_frequency: 20,
              analysis_status: 'active'
            })
            .eq('page_path', pageRoute)
            .select()
            .single();

          if (updateError) throw updateError;
          setThreadAnalysis(updatedAnalysis);
          setIsConnected(true);
          
          toast({
            title: "Claude System Connected",
            description: "Analysis thread synchronized successfully.",
          });
        }

        setSystemHealth(prev => ({
          ...prev,
          claudeStatus: 'active',
          syncStatus: 'connected'
        }));

        // Start initial analysis
        await startClaudeAnalysis();

      } catch (error) {
        console.error('Error initializing Claude system:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying initialization (${retryCount}/${maxRetries})...`);
          setTimeout(initSystem, 2000);
        } else {
          setSystemHealth(prev => ({
            ...prev,
            claudeStatus: 'error',
            syncStatus: 'error'
          }));
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Failed to initialize Claude system. Please try again.",
          });
        }
      }
    };

    initSystem();
  }, [pageRoute]);

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

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleCommandSubmit = async () => {
    if (!commandInput.trim()) {
      toast({
        title: "Command Required",
        description: "Please enter a command for Claude to process.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Processing strategic command:', commandInput);
    setIsAnalyzing(true);
    
    try {
      const startTime = new Date().toISOString();
      console.log(`[${startTime}] Sending command to Claude compute function`);

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

      const endTime = new Date().toISOString();
      console.log(`[${endTime}] Received response from Claude:`, analysisData);

      const { data: threadUpdate, error: updateError } = await supabase
        .from('debug_thread_analysis')
        .upsert({
          page_path: pageRoute,
          thread_type: 'claude-analysis',
          analysis_data: {
            ...analysisData,
            iteration: analysisCount + 1,
            timestamp: new Date().toISOString(),
            command: commandInput,
            execution_time: {
              start: startTime,
              end: endTime
            }
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

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-200">System Command Center</h3>
            <Badge 
              variant={getBadgeVariant(systemHealth.claudeStatus)}
              className={`${systemHealth.claudeStatus === 'active' ? 'animate-pulse' : ''}`}
            >
              Claude: {systemHealth.claudeStatus}
            </Badge>
            <Badge 
              variant={getBadgeVariant(systemHealth.syncStatus)}
            >
              Sync: {systemHealth.syncStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setAutoAnalysis(!autoAnalysis)}
              className={autoAnalysis ? 'bg-green-500/20' : ''}
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
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-blue-500/20"
            >
              <Power className="h-4 w-4 mr-2" />
              Reconnect
            </Button>
          </div>
        </div>

        {/* Claude Activity Log */}
        <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-gray-300">Claude Activity Log</h4>
          </div>
          <ScrollArea className="h-[200px] border border-gray-700 rounded-md p-2">
            {threadAnalysis?.analysis_data?.execution_time && (
              <div className="text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span>Start: {threadAnalysis.analysis_data.execution_time.start}</span>
                  <span>End: {threadAnalysis.analysis_data.execution_time.end}</span>
                </div>
                <div className="mt-2">
                  Command: {threadAnalysis.analysis_data.command}
                </div>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(threadAnalysis.analysis_data, null, 2)}
                </pre>
              </div>
            )}
            {!threadAnalysis?.analysis_data?.execution_time && (
              <div className="text-center text-gray-500 py-4">
                No Claude activity logged yet. Try sending a command.
              </div>
            )}
          </ScrollArea>
        </div>

        {/* System Status */}
        {threadAnalysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                Score: {threadAnalysis.connection_score || 0}
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
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Strategic Command Input</label>
            <div className="flex gap-2 relative">
              <div 
                className="flex-1 relative"
                onMouseEnter={() => setShowInstructions(true)}
                onMouseLeave={() => setShowInstructions(false)}
              >
                <Textarea
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Enter strategic directive for Claude..."
                  className="flex-1 pr-10"
                  disabled={!isConnected}
                />
                {showInstructions && (
                  <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-800 p-3 rounded-md shadow-lg border border-gray-700 z-10">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MousePointer className="h-4 w-4 text-blue-400 animate-pulse" />
                      <span>Type your command here</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-2">
                      <Send className="h-4 w-4 text-green-400" />
                      <span>Click Execute or press Enter to send</span>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleCommandSubmit}
                disabled={isAnalyzing || !isConnected}
                className="self-start relative group"
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
        </div>
      </div>
    </ScrollArea>
  );
}
