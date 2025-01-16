import { useEffect, useState, useCallback } from 'react';
import { Brain, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ThreadAnalysis, SystemLoad, NetworkStats, PerformanceMetrics } from '@/types/agent';

interface ClaudeAnalysisProps {
  pageRoute: string;
  agentState?: {
    agents?: any[];
    actions?: any[];
  };
}

const defaultAnalysis: ThreadAnalysis = {
  id: '',
  page_path: '',
  thread_type: '',
  system_load: {
    cpu: 0,
    memory: 0,
    network: 0
  },
  performance_metrics: {
    response_time: [],
    success_rate: [],
    error_rate: []
  },
  network_stats: {
    latency: [],
    bandwidth: [],
    connections: []
  },
  analysis_status: 'pending',
  last_analysis_timestamp: new Date().toISOString(),
  connection_status: 'pending',
  connection_score: 0,
  analysis_data: {},
  agent_states: {}
};

export function ClaudeAnalysis({ pageRoute, agentState }: ClaudeAnalysisProps) {
  const [analysis, setAnalysis] = useState<ThreadAnalysis>(defaultAnalysis);
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  const initSystem = useCallback(async () => {
    if (isInitializing) return;
    
    try {
      setIsInitializing(true);
      console.log('Initializing Claude system...');

      const { data, error } = await supabase
        .from('debug_thread_analysis')
        .select('*')
        .eq('page_path', pageRoute)
        .eq('thread_type', 'claude')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        console.log('Found existing analysis:', data);
        const transformedData: ThreadAnalysis = {
          id: data.id,
          page_path: data.page_path,
          thread_type: data.thread_type,
          system_load: data.system_load as SystemLoad,
          performance_metrics: data.performance_metrics as PerformanceMetrics,
          network_stats: data.network_stats as NetworkStats,
          analysis_status: data.analysis_status,
          last_analysis_timestamp: data.last_analysis_timestamp,
          connection_status: data.connection_status,
          connection_score: data.connection_score,
          analysis_data: data.analysis_data || {},
          agent_states: data.agent_states || {},
          agent_feedback: data.agent_feedback,
          auto_analysis_enabled: data.auto_analysis_enabled,
          analysis_interval: data.analysis_interval
        };
        setAnalysis(transformedData);
      } else {
        console.log('Creating new analysis for route:', pageRoute);
        const { data: newAnalysis, error: insertError } = await supabase
          .from('debug_thread_analysis')
          .insert({
            page_path: pageRoute,
            thread_type: 'claude',
            analysis_status: 'initialized',
            last_analysis_timestamp: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        const transformedNewAnalysis: ThreadAnalysis = {
          id: newAnalysis.id,
          page_path: newAnalysis.page_path,
          thread_type: newAnalysis.thread_type,
          system_load: newAnalysis.system_load as SystemLoad,
          performance_metrics: newAnalysis.performance_metrics as PerformanceMetrics,
          network_stats: newAnalysis.network_stats as NetworkStats,
          analysis_status: newAnalysis.analysis_status,
          last_analysis_timestamp: newAnalysis.last_analysis_timestamp,
          connection_status: newAnalysis.connection_status,
          connection_score: newAnalysis.connection_score,
          analysis_data: newAnalysis.analysis_data || {},
          agent_states: newAnalysis.agent_states || {}
        };
        setAnalysis(transformedNewAnalysis);
      }
    } catch (error: any) {
      console.error('Error initializing Claude system:', error);
      toast({
        variant: "destructive",
        title: "Initialization Error",
        description: "Failed to initialize Claude system"
      });
    } finally {
      setIsInitializing(false);
    }
  }, [pageRoute, toast, isInitializing]);

  useEffect(() => {
    // Only initialize if we have a valid route and aren't already initializing
    if (pageRoute && !isInitializing) {
      initSystem();
    }

    const channel = supabase
      .channel('claude-analysis')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'debug_thread_analysis',
          filter: `thread_type=eq.claude`
        },
        (payload) => {
          console.log('Analysis update received:', payload);
          if (payload.new) {
            setAnalysis(payload.new as ThreadAnalysis);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Claude analysis subscription');
      supabase.removeChannel(channel);
    };
  }, [pageRoute, initSystem]);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-200">
          <Brain className="h-4 w-4 text-primary inline mr-2" />
          Claude Analysis
          <Badge 
            variant={analysis.analysis_status === 'completed' ? "default" : "secondary"}
            className="ml-2"
          >
            {analysis.analysis_status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Last Analysis: {new Date(analysis.last_analysis_timestamp).toLocaleString()}
            </div>
            {/* Display analysis results */}
            {analysis.analysis_data && Object.keys(analysis.analysis_data).length > 0 && (
              <div className="space-y-2">
                {Object.entries(analysis.analysis_data).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-gray-400">{key}:</span>
                    <span className="text-gray-300 ml-2">
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
