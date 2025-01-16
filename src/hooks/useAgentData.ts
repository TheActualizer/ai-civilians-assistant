import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { AgentMetricsData } from '@/types/agent';
import { useToast } from "@/hooks/use-toast";

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

export function useAgentData() {
  const [metrics, setMetrics] = useState<AgentMetricsData>(initialMetrics);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing metrics subscription...');
    
    const channel = supabase
      .channel('agent-metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_metrics'
        },
        (payload: any) => {
          console.log('New metrics received:', payload);
          setLastUpdate(new Date().toISOString());
          
          const system_load = typeof payload.new.system_load === 'string' 
            ? JSON.parse(payload.new.system_load)
            : payload.new.system_load || initialMetrics.system_load;

          const network_metrics = typeof payload.new.network_metrics === 'string'
            ? JSON.parse(payload.new.network_metrics)
            : payload.new.network_metrics || initialMetrics.network_metrics;

          const performance_indicators = typeof payload.new.performance_indicators === 'string'
            ? JSON.parse(payload.new.performance_indicators)
            : payload.new.performance_indicators || initialMetrics.performance_indicators;

          const newMetrics: AgentMetricsData = {
            timestamp: payload.new.timestamp,
            cpu_usage: payload.new.cpu_usage || 0,
            memory_usage: payload.new.memory_usage || 0,
            network_latency: payload.new.network_latency || 0,
            active_flows: payload.new.active_flows || 0,
            success_rate: payload.new.success_rate || 0,
            total_interactions: payload.new.total_interactions || 0,
            system_load,
            network_metrics,
            performance_indicators
          };

          setMetrics(newMetrics);
          
          setHistoricalData(prev => [...prev, {
            timestamp: new Date().toISOString(),
            cpu: newMetrics.cpu_usage,
            memory: newMetrics.memory_usage,
            network: newMetrics.network_latency
          }].slice(-20));
        }
      )
      .subscribe();

    const fetchInitialMetrics = async () => {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching metrics:', error);
        toast({
          variant: "destructive",
          title: "Error fetching metrics",
          description: error.message
        });
        return;
      }

      if (data) {
        const system_load = typeof data.system_load === 'string' 
          ? JSON.parse(data.system_load)
          : data.system_load || initialMetrics.system_load;

        const network_metrics = typeof data.network_metrics === 'string'
          ? JSON.parse(data.network_metrics)
          : data.network_metrics || initialMetrics.network_metrics;

        const performance_indicators = typeof data.performance_indicators === 'string'
          ? JSON.parse(data.performance_indicators)
          : data.performance_indicators || initialMetrics.performance_indicators;

        const initialData: AgentMetricsData = {
          timestamp: data.timestamp,
          cpu_usage: data.cpu_usage || 0,
          memory_usage: data.memory_usage || 0,
          network_latency: data.network_latency || 0,
          active_flows: data.active_flows || 0,
          success_rate: data.success_rate || 0,
          total_interactions: data.total_interactions || 0,
          system_load,
          network_metrics,
          performance_indicators
        };
        setMetrics(initialData);
      }
    };

    fetchInitialMetrics();

    return () => {
      console.log('Cleaning up metrics subscription');
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return {
    metrics,
    historicalData,
    lastUpdate
  };
}