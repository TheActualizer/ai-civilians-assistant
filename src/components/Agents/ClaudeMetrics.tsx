import { useEffect, useState } from 'react';
import { Brain, Activity, Cpu, Network, Shield, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
}

interface PerformanceMetrics {
  response_time: number[];
  success_rate: number[];
  error_rate: number[];
}

interface NetworkStats {
  latency: number[];
  bandwidth: number[];
  connections: number[];
}

interface MetricsState {
  system_load: SystemLoad;
  performance_metrics: PerformanceMetrics;
  network_stats: NetworkStats;
}

interface ClaudeMetricsProps {
  threadId: string;
}

const defaultMetrics: MetricsState = {
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
};

export function ClaudeMetrics({ threadId }: ClaudeMetricsProps) {
  const [metrics, setMetrics] = useState<MetricsState>(defaultMetrics);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing Claude metrics monitoring for thread:', threadId);
    
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
            const newData = payload.new as any;
            
            // Safely parse and validate metrics data
            const systemLoad = typeof newData.system_load === 'object' ? newData.system_load : defaultMetrics.system_load;
            const perfMetrics = typeof newData.performance_metrics === 'object' ? newData.performance_metrics : defaultMetrics.performance_metrics;
            const netStats = typeof newData.network_stats === 'object' ? newData.network_stats : defaultMetrics.network_stats;

            setMetrics({
              system_load: {
                cpu: Number(systemLoad.cpu) || 0,
                memory: Number(systemLoad.memory) || 0,
                network: Number(systemLoad.network) || 0
              },
              performance_metrics: {
                response_time: Array.isArray(perfMetrics.response_time) ? perfMetrics.response_time : [],
                success_rate: Array.isArray(perfMetrics.success_rate) ? perfMetrics.success_rate : [],
                error_rate: Array.isArray(perfMetrics.error_rate) ? perfMetrics.error_rate : []
              },
              network_stats: {
                latency: Array.isArray(netStats.latency) ? netStats.latency : [],
                bandwidth: Array.isArray(netStats.bandwidth) ? netStats.bandwidth : [],
                connections: Array.isArray(netStats.connections) ? netStats.connections : []
              }
            });

            setLastUpdate(new Date().toISOString());
            
            // Log detailed metrics to system_metrics table
            logDetailedMetrics(payload.new);
          }
        }
      )
      .subscribe();

    // Initial metrics fetch
    const fetchInitialMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('debug_thread_analysis')
          .select('*')
          .eq('id', threadId)
          .single();

        if (error) throw error;

        if (data) {
          console.log('Initial metrics loaded:', data);
          const systemLoad = typeof data.system_load === 'object' ? data.system_load : defaultMetrics.system_load;
          const perfMetrics = typeof data.performance_metrics === 'object' ? data.performance_metrics : defaultMetrics.performance_metrics;
          const netStats = typeof data.network_stats === 'object' ? data.network_stats : defaultMetrics.network_stats;

          setMetrics({
            system_load: {
              cpu: Number(systemLoad.cpu) || 0,
              memory: Number(systemLoad.memory) || 0,
              network: Number(systemLoad.network) || 0
            },
            performance_metrics: {
              response_time: Array.isArray(perfMetrics.response_time) ? perfMetrics.response_time : [],
              success_rate: Array.isArray(perfMetrics.success_rate) ? perfMetrics.success_rate : [],
              error_rate: Array.isArray(perfMetrics.error_rate) ? perfMetrics.error_rate : []
            },
            network_stats: {
              latency: Array.isArray(netStats.latency) ? netStats.latency : [],
              bandwidth: Array.isArray(netStats.bandwidth) ? netStats.bandwidth : [],
              connections: Array.isArray(netStats.connections) ? netStats.connections : []
            }
          });
        }
      } catch (error) {
        console.error('Error fetching initial metrics:', error);
        toast({
          variant: "destructive",
          title: "Error fetching metrics",
          description: error.message
        });
      }
    };

    fetchInitialMetrics();

    return () => {
      console.log('Cleaning up metrics subscription');
      supabase.removeChannel(channel);
    };
  }, [threadId, toast]);

  const logDetailedMetrics = async (data: any) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Log system metrics
      await supabase.from('system_metrics').insert([
        {
          metric_type: 'claude_system_load',
          value: data.system_load?.cpu || 0,
          component: 'claude',
          metadata: {
            thread_id: threadId,
            timestamp,
            context: 'system_load',
            full_metrics: data.system_load
          }
        }
      ]);

      console.log('Detailed metrics logged successfully', {
        timestamp,
        threadId,
        metrics: data
      });
    } catch (error) {
      console.error('Error logging detailed metrics:', error);
    }
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