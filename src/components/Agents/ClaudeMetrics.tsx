import { useEffect, useState } from 'react';
import { Brain, Activity, Cpu, Network, Shield, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface ClaudeMetricsProps {
  threadId: string;
}

interface MetricsState {
  system_load: {
    cpu: number;
    memory: number;
    network: number;
  };
  performance_metrics: {
    response_time: number[];
    success_rate: number[];
    error_rate: number[];
  };
  network_stats: {
    latency: number[];
    bandwidth: number[];
    connections: number[];
  };
}

export function ClaudeMetrics({ threadId }: ClaudeMetricsProps) {
  const [metrics, setMetrics] = useState<MetricsState>({
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
    }
  });

  useEffect(() => {
    console.log('Initializing Claude metrics monitoring for thread:', threadId);
    
    // First fetch current state
    const fetchInitialMetrics = async () => {
      const { data, error } = await supabase
        .from('debug_thread_analysis')
        .select('system_load, performance_metrics, network_stats')
        .eq('id', threadId)
        .single();

      if (error) {
        console.error('Error fetching initial metrics:', error);
        return;
      }

      console.log('Initial metrics loaded:', data);
      if (data) {
        setMetrics({
          system_load: data.system_load || metrics.system_load,
          performance_metrics: data.performance_metrics || metrics.performance_metrics,
          network_stats: data.network_stats || metrics.network_stats
        });
      }
    };

    fetchInitialMetrics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`claude-metrics-${threadId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'debug_thread_analysis',
          filter: `id=eq.${threadId}`
        },
        (payload) => {
          console.log('Received metrics update:', {
            timestamp: new Date().toISOString(),
            payload,
            threadId
          });

          if (payload.new) {
            setMetrics(prev => ({
              system_load: payload.new.system_load || prev.system_load,
              performance_metrics: payload.new.performance_metrics || prev.performance_metrics,
              network_stats: payload.new.network_stats || prev.network_stats
            }));

            // Log detailed metrics to system_metrics table
            logDetailedMetrics(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Claude metrics subscription');
      supabase.removeChannel(channel);
    };
  }, [threadId]);

  const logDetailedMetrics = async (data: any) => {
    const timestamp = new Date().toISOString();
    
    // Log CPU metrics
    await supabase.from('system_metrics').insert([
      {
        metric_type: 'cpu_usage',
        value: data.system_load?.cpu || 0,
        component: 'claude',
        metadata: {
          thread_id: threadId,
          timestamp,
          context: 'system_load'
        }
      }
    ]);

    // Log memory metrics
    await supabase.from('system_metrics').insert([
      {
        metric_type: 'memory_usage',
        value: data.system_load?.memory || 0,
        component: 'claude',
        metadata: {
          thread_id: threadId,
          timestamp,
          context: 'system_load'
        }
      }
    ]);

    // Log performance metrics
    const performanceData = data.performance_metrics || {};
    Object.entries(performanceData).forEach(async ([metric, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        await supabase.from('system_metrics').insert([
          {
            metric_type: metric,
            value: value[value.length - 1],
            component: 'claude',
            metadata: {
              thread_id: threadId,
              timestamp,
              context: 'performance',
              history: value
            }
          }
        ]);
      }
    });

    console.log('Detailed metrics logged to system_metrics table', {
      timestamp,
      threadId,
      metrics: data
    });
  };

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              <Cpu className="h-4 w-4 text-blue-400 inline mr-2" />
              CPU Usage
            </CardTitle>
            <Badge variant="outline" className="bg-blue-500/10">
              {metrics.system_load.cpu.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.system_load.cpu} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              <Database className="h-4 w-4 text-purple-400 inline mr-2" />
              Memory
            </CardTitle>
            <Badge variant="outline" className="bg-purple-500/10">
              {metrics.system_load.memory.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.system_load.memory} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              <Network className="h-4 w-4 text-green-400 inline mr-2" />
              Network
            </CardTitle>
            <Badge variant="outline" className="bg-green-500/10">
              {metrics.system_load.network.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.system_load.network} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-gray-100">Performance Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Response Time</span>
                  <Badge variant="outline" className="bg-blue-500/10">
                    {metrics.performance_metrics.response_time[metrics.performance_metrics.response_time.length - 1]?.toFixed(2) || 0}ms
                  </Badge>
                </div>
                <Progress 
                  value={metrics.performance_metrics.response_time[metrics.performance_metrics.response_time.length - 1] || 0} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Success Rate</span>
                  <Badge variant="outline" className="bg-green-500/10">
                    {metrics.performance_metrics.success_rate[metrics.performance_metrics.success_rate.length - 1]?.toFixed(1) || 0}%
                  </Badge>
                </div>
                <Progress 
                  value={metrics.performance_metrics.success_rate[metrics.performance_metrics.success_rate.length - 1] || 0} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Error Rate</span>
                  <Badge variant="outline" className="bg-red-500/10">
                    {metrics.performance_metrics.error_rate[metrics.performance_metrics.error_rate.length - 1]?.toFixed(1) || 0}%
                  </Badge>
                </div>
                <Progress 
                  value={metrics.performance_metrics.error_rate[metrics.performance_metrics.error_rate.length - 1] || 0} 
                  className="h-2" 
                />
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}