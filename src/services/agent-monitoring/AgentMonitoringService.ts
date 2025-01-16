import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AgentMetrics {
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
  active_flows: number;
  success_rate: number;
  total_interactions: number;
}

export interface AgentStatus {
  id: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  lastAction: string;
  metrics: AgentMetrics;
}

class AgentMonitoringService {
  private channel: ReturnType<typeof supabase.channel> | null = null;

  async initialize() {
    console.log('Initializing Agent Monitoring Service...');
    
    this.channel = supabase
      .channel('agent-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_interactions'
        },
        (payload) => {
          console.log('Agent interaction update:', payload);
          this.handleAgentUpdate(payload);
        }
      )
      .subscribe(status => {
        console.log('Agent monitoring subscription status:', status);
      });

    return this;
  }

  private handleAgentUpdate(payload: any) {
    const { new: newData, eventType } = payload;
    
    if (eventType === 'INSERT') {
      toast({
        title: "New Agent Activity",
        description: `Agent ${newData.agent_id} performed ${newData.action}`,
      });
    }
  }

  async getAgentMetrics(): Promise<AgentMetrics[]> {
    console.log('Fetching agent metrics...');
    const { data, error } = await supabase
      .from('agent_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching agent metrics:', error);
      throw error;
    }

    return data;
  }

  async getAgentStatus(agentId: string): Promise<AgentStatus> {
    console.log('Fetching agent status:', agentId);
    const { data, error } = await supabase
      .from('debug_agent_monitoring')
      .select('*')
      .eq('agent_id', agentId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching agent status:', error);
      throw error;
    }

    if (!data) {
      throw new Error(`No status found for agent ${agentId}`);
    }

    return {
      id: data.agent_id,
      status: data.status,
      lastAction: data.last_action,
      metrics: data.metrics
    };
  }

  async logAgentAction(agentId: string, action: string, details: any = {}) {
    console.log('Logging agent action:', { agentId, action, details });
    const { data, error } = await supabase
      .rpc('log_agent_interaction', {
        agent_id: agentId,
        action,
        details
      });

    if (error) {
      console.error('Error logging agent action:', error);
      throw error;
    }

    return data;
  }

  cleanup() {
    if (this.channel) {
      console.log('Cleaning up Agent Monitoring Service...');
      supabase.removeChannel(this.channel);
    }
  }
}

export const agentMonitoringService = new AgentMonitoringService();