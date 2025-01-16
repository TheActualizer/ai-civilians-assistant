import { useState, useEffect } from 'react';
import { AlertCircle, Brain } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<number | null>(null);

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
      const interval = window.setInterval(startClaudeAnalysis, 300000); // Run every 5 minutes
      setAnalysisInterval(interval);
      console.log('Started automated Claude analysis');
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
    console.log('Starting Claude analysis...');
    setIsAnalyzing(true);
    
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('claude-compute', {
        body: {
          messages: [{ 
            role: 'user', 
            content: 'Analyze the current page state and identify potential issues or improvements.' 
          }],
          systemPrompt: 'You are an expert system analyzer. Identify UI/UX issues, data inconsistencies, and potential improvements.',
          pageContext: {
            route: pageRoute,
            agents: agentState.agents,
            actions: agentState.actions
          }
        }
      });

      if (error) throw error;

      const { data: threadUpdate, error: updateError } = await supabase
        .from('debug_thread_analysis')
        .upsert({
          page_path: pageRoute,
          thread_type: 'claude-analysis',
          analysis_data: analysisData,
          analysis_status: 'completed',
          last_analysis_timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (updateError) throw updateError;

      setThreadAnalysis(threadUpdate);
      
      toast({
        title: "Analysis Complete",
        description: "Claude has analyzed the current page state.",
      });
    } catch (error) {
      console.error('Error in Claude analysis:', error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to complete Claude analysis.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-200">Thread Analysis</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setAutoAnalysis(!autoAnalysis)}
              className={autoAnalysis ? 'bg-green-500/20 border-green-500' : ''}
            >
              {autoAnalysis ? 'Stop Auto Analysis' : 'Start Auto Analysis'}
            </Button>
            <Button 
              variant="outline"
              onClick={startClaudeAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis Now'}
            </Button>
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