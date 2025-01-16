import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AgentMetricsData, DifyAgent } from '@/types/agent';
import { useToast } from "@/hooks/use-toast";

const initialMetrics: AgentMetricsData = {
  cpuUsage: 0,
  memoryUsage: 0,
  networkLatency: 0,
  activeFlows: 0,
  successRate: 0,
  totalInteractions: 0,
  systemLoad: {
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
        (payload) => {
          console.log('New metrics received:', payload);
          setLastUpdate(new Date().toISOString());
          
          const newMetrics: AgentMetricsData = {
            cpuUsage: payload.new.cpu_usage || 0,
            memoryUsage: payload.new.memory_usage || 0,
            networkLatency: payload.new.network_latency || 0,
            activeFlows: payload.new.active_flows || 0,
            successRate: payload.new.success_rate || 0,
            totalInteractions: payload.new.total_interactions || 0,
            systemLoad: payload.new.system_load || initialMetrics.systemLoad,
            networkMetrics: payload.new.network_metrics || initialMetrics.networkMetrics,
            performanceIndicators: payload.new.performance_indicators || initialMetrics.performanceIndicators
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
        const initialData: AgentMetricsData = {
          cpuUsage: data.cpu_usage || 0,
          memoryUsage: data.memory_usage || 0,
          networkLatency: data.network_latency || 0,
          activeFlows: data.active_flows || 0,
          successRate: data.success_rate || 0,
          totalInteractions: data.total_interactions || 0,
          systemLoad: data.system_load || initialMetrics.systemLoad,
          networkMetrics: data.network_metrics || initialMetrics.networkMetrics,
          performanceIndicators: data.performance_indicators || initialMetrics.performanceIndicators
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