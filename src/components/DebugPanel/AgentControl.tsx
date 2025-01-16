import { useState, useEffect } from 'react';
import { Brain, Zap, Network, RotateCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AgentControl() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisQueue, setAnalysisQueue] = useState<any[]>([]);
  const [systemScore, setSystemScore] = useState(0);

  useEffect(() => {
    const channel = supabase
      .channel('agent-analysis')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'debug_thread_analysis'
        },
        (payload) => {
          console.log('New analysis received:', payload);
          setAnalysisQueue(prev => [...prev, payload.new]);
          
          if (payload.new.connection_score > 0) {
            setSystemScore(prev => prev + payload.new.connection_score);
            toast({
              title: "Thread Connected! 🎯",
              description: `New connection established with score: ${payload.new.connection_score}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    console.log('Initiating comprehensive system analysis...');

    try {
      const { data: threadData, error: threadError } = await supabase
        .from('debug_thread_analysis')
        .insert({
          page_path: window.location.pathname,
          thread_type: 'system-analysis',
          analysis_status: 'pending',
          analysis_data: {
            initiated_by: 'claude',
            analysis_type: 'comprehensive',
            target_improvements: [
              'API Integration',
              'Thread Connection',
              'System Synergy'
            ]
          }
        })
        .select()
        .single();

      if (threadError) throw threadError;

      console.log('Analysis thread created:', threadData);
      
      toast({
        title: "Analysis Started",
        description: "Claude is now analyzing the system for improvements.",
      });

    } catch (error) {
      console.error('Error starting analysis:', error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to start system analysis.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-gray-100">Agent Control Center</CardTitle>
            </div>
            <Button
              variant="outline"
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className={isAnalyzing ? 'bg-purple-500/20' : ''}
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">System Score</span>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                {systemScore} points
              </Badge>
            </div>

            <Progress value={systemScore % 100} className="h-2" />
            
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {analysisQueue.map((analysis, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                        {analysis.thread_type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(analysis.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {JSON.stringify(analysis.analysis_data)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}