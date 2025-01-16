import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Cpu, Network, Database } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

type MetricsData = {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeFlows: number;
  successRate: number;
  totalInteractions: number;
};

export function AgentMetrics() {
  const [metrics, setMetrics] = useState<MetricsData>({
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    activeFlows: 0,
    successRate: 0,
    totalInteractions: 0
  });

  useEffect(() => {
    // Subscribe to real-time metrics updates
    const channel = supabase
      .channel('agent-metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_metrics'
        },
        (payload) => {
          console.log('New metrics:', payload);
          const { cpu_usage, memory_usage, network_latency, active_flows, success_rate, total_interactions } = payload.new;
          setMetrics({
            cpuUsage: cpu_usage || 0,
            memoryUsage: memory_usage || 0,
            networkLatency: network_latency || 0,
            activeFlows: active_flows || 0,
            successRate: success_rate || 0,
            totalInteractions: total_interactions || 0
          });
        }
      )
      .subscribe();

    // Fetch initial metrics
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching metrics:', error);
        return;
      }

      if (data) {
        setMetrics({
          cpuUsage: data.cpu_usage || 0,
          memoryUsage: data.memory_usage || 0,
          networkLatency: data.network_latency || 0,
          activeFlows: data.active_flows || 0,
          successRate: data.success_rate || 0,
          totalInteractions: data.total_interactions || 0
        });
      }
    };

    fetchMetrics();

    // Simulate metrics updates for demo purposes
    const interval = setInterval(async () => {
      const newMetrics = {
        cpu_usage: Math.random() * 100,
        memory_usage: Math.random() * 100,
        network_latency: Math.random() * 200,
        active_flows: Math.floor(Math.random() * 10),
        success_rate: 75 + Math.random() * 25,
        total_interactions: Math.floor(Math.random() * 1000),
        metrics_data: {}
      };

      const { error } = await supabase
        .from('agent_metrics')
        .insert([newMetrics]);

      if (error) {
        console.error('Error inserting metrics:', error);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            <Cpu className="h-4 w-4 text-primary inline mr-2" />
            System Load
          </CardTitle>
          <Badge 
            variant={metrics.cpuUsage > 80 ? "destructive" : "default"}
            className="bg-green-500/10 text-green-400"
          >
            {metrics.cpuUsage > 80 ? 'High' : 'Normal'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-gray-400">{metrics.cpuUsage.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Memory</span>
                <span className="text-gray-400">{metrics.memoryUsage.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            <Network className="h-4 w-4 text-primary inline mr-2" />
            Network Status
          </CardTitle>
          <Badge 
            variant={metrics.networkLatency > 150 ? "destructive" : "default"}
            className="bg-blue-500/10 text-blue-400"
          >
            {metrics.networkLatency > 150 ? 'High Latency' : 'Optimal'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Latency</span>
              <span className="text-lg font-semibold text-gray-200">
                {metrics.networkLatency.toFixed(0)}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Active Flows</span>
              <span className="text-lg font-semibold text-gray-200">
                {metrics.activeFlows}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            <Activity className="h-4 w-4 text-primary inline mr-2" />
            Performance
          </CardTitle>
          <Badge 
            variant={metrics.successRate > 90 ? "default" : "secondary"}
            className="bg-yellow-500/10 text-yellow-400"
          >
            {metrics.successRate > 90 ? 'Excellent' : 'Good'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-gray-400">{metrics.successRate.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.successRate} className="h-2" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Total Interactions</span>
              <span className="text-lg font-semibold text-gray-200">
                {metrics.totalInteractions.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-200">
            <Database className="h-4 w-4 text-primary inline mr-2" />
            System Health
          </CardTitle>
          <Badge 
            variant="default"
            className="bg-emerald-500/10 text-emerald-400"
          >
            Healthy
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Uptime</span>
                <span className="text-lg font-semibold text-gray-200">99.9%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Response Time</span>
                <span className="text-lg font-semibold text-gray-200">120ms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
