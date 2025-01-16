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

export function ClaudeMetrics({ threadId }: ClaudeMetricsProps) {
  const [metrics, setMetrics] = useState<any>({
    cpu: 0,
    memory: 0,
    network: 0,
    responseTime: [],
    successRate: [],
    errorRate: []
  });

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
          console.log('Received metrics update:', payload);
          if (payload.new) {
            setMetrics({
              cpu: payload.new.system_load?.cpu || 0,
              memory: payload.new.system_load?.memory || 0,
              network: payload.new.system_load?.network || 0,
              responseTime: payload.new.performance_metrics?.response_time || [],
              successRate: payload.new.performance_metrics?.success_rate || [],
              errorRate: payload.new.performance_metrics?.error_rate || []
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Claude metrics subscription');
      supabase.removeChannel(channel);
    };
  }, [threadId]);

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
              {metrics.cpu.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.cpu} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              <Database className="h-4 w-4 text-purple-400 inline mr-2" />
              Memory
            </CardTitle>
            <Badge variant="outline" className="bg-purple-500/10">
              {metrics.memory.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.memory} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              <Network className="h-4 w-4 text-green-400 inline mr-2" />
              Network
            </CardTitle>
            <Badge variant="outline" className="bg-green-500/10">
              {metrics.network.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.network} className="h-2" />
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
                    {metrics.responseTime[metrics.responseTime.length - 1]?.toFixed(2) || 0}ms
                  </Badge>
                </div>
                <Progress 
                  value={metrics.responseTime[metrics.responseTime.length - 1] || 0} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Success Rate</span>
                  <Badge variant="outline" className="bg-green-500/10">
                    {metrics.successRate[metrics.successRate.length - 1]?.toFixed(1) || 0}%
                  </Badge>
                </div>
                <Progress 
                  value={metrics.successRate[metrics.successRate.length - 1] || 0} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Error Rate</span>
                  <Badge variant="outline" className="bg-red-500/10">
                    {metrics.errorRate[metrics.errorRate.length - 1]?.toFixed(1) || 0}%
                  </Badge>
                </div>
                <Progress 
                  value={metrics.errorRate[metrics.errorRate.length - 1] || 0} 
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