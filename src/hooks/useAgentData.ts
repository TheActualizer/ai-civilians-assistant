import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { AgentMetricsData } from '@/types/agent';
import { useToast } from "@/hooks/use-toast";

const initialMetrics: AgentMetricsData = {
  cpuUsage: 0,
  memoryUsage: 0,
  networkLatency: 0,
  activeFlows: 0,
  successRate: 0,
  totalInteractions: 0,
  system_load: {
    cpu_threads: [],
    io_operations: [],
    memory_allocation: []
  },
  networkMetrics: {
    bandwidth_usage: [],
    connection_pool: [],
    latency_history: []
  },
  performanceIndicators: {
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

          const networkMetrics = typeof payload.new.network_metrics === 'string'
            ? JSON.parse(payload.new.network_metrics)
            : payload.new.network_metrics || initialMetrics.networkMetrics;

          const performanceIndicators = typeof payload.new.performance_indicators === 'string'
            ? JSON.parse(payload.new.performance_indicators)
            : payload.new.performance_indicators || initialMetrics.performanceIndicators;

          const newMetrics: AgentMetricsData = {
            cpuUsage: payload.new.cpu_usage || 0,
            memoryUsage: payload.new.memory_usage || 0,
            networkLatency: payload.new.network_latency || 0,
            activeFlows: payload.new.active_flows || 0,
            successRate: payload.new.success_rate || 0,
            totalInteractions: payload.new.total_interactions || 0,
            system_load,
            networkMetrics,
            performanceIndicators
          };

          setMetrics(newMetrics);
          
          setHistoricalData(prev => [...prev, {
            timestamp: new Date().toISOString(),
            cpu: newMetrics.cpuUsage,
            memory: newMetrics.memoryUsage,
            network: newMetrics.networkLatency
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
        .single();

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

        const networkMetrics = typeof data.network_metrics === 'string'
          ? JSON.parse(data.network_metrics)
          : data.network_metrics || initialMetrics.networkMetrics;

        const performanceIndicators = typeof data.performance_indicators === 'string'
          ? JSON.parse(data.performance_indicators)
          : data.performance_indicators || initialMetrics.performanceIndicators;

        const initialData: AgentMetricsData = {
          cpuUsage: data.cpu_usage || 0,
          memoryUsage: data.memory_usage || 0,
          networkLatency: data.network_latency || 0,
          activeFlows: data.active_flows || 0,
          successRate: data.success_rate || 0,
          totalInteractions: data.total_interactions || 0,
          system_load,
          networkMetrics,
          performanceIndicators
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