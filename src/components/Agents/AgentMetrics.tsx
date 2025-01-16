import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AgentMetricsData {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
  active_flows: number;
  success_rate: number;
  total_interactions: number;
  system_load: {
    cpu_threads: number[];
    io_operations: number[];
    memory_allocation: number[];
  };
  network_metrics: {
    bandwidth_usage: number[];
    connection_pool: number[];
    latency_history: number[];
  };
  performance_indicators: {
    error_rate: number[];
    throughput: number[];
    response_times: number[];
  };
}

export function AgentMetrics() {
  const initialMetrics: AgentMetricsData = {
    timestamp: new Date().toISOString(),
    cpu_usage: 0,
    memory_usage: 0,
    network_latency: 0,
    active_flows: 0,
    success_rate: 0,
    total_interactions: 0,
    system_load: {
      cpu_threads: [],
      io_operations: [],
      memory_allocation: []
    },
    network_metrics: {
      bandwidth_usage: [],
      connection_pool: [],
      latency_history: []
    },
    performance_indicators: {
      error_rate: [],
      throughput: [],
      response_times: []
    }
  };

  const [metrics, setMetrics] = useState<AgentMetricsData>(initialMetrics);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('agent_metrics')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast({
          title: "Error",
          description: "Failed to fetch agent metrics.",
          variant: "destructive",
        });
      }
    };

    fetchMetrics();
  }, [toast]);

  return (
    <div>
      <h2 className="text-lg font-semibold">Agent Metrics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-md font-medium">CPU Usage</h3>
          <p>{metrics.cpu_usage}%</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-md font-medium">Memory Usage</h3>
          <p>{metrics.memory_usage} MB</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-md font-medium">Network Latency</h3>
          <p>{metrics.network_latency} ms</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-md font-medium">Active Flows</h3>
          <p>{metrics.active_flows}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-md font-medium">Success Rate</h3>
          <p>{metrics.success_rate}%</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-md font-medium">Total Interactions</h3>
          <p>{metrics.total_interactions}</p>
        </div>
      </div>
    </div>
  );
}
