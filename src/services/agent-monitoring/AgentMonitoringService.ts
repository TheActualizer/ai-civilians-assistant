import { supabase } from "@/integrations/supabase/client";
import type { DifyAgent, AgentMetricsData } from "@/types/agent";

class AgentMonitoringService {
  private static instance: AgentMonitoringService;
  private agents: Map<string, DifyAgent> = new Map();

  private constructor() {}

  static getInstance(): AgentMonitoringService {
    if (!AgentMonitoringService.instance) {
      AgentMonitoringService.instance = new AgentMonitoringService();
    }
    return AgentMonitoringService.instance;
  }

  async initialize() {
    console.log('Initializing agent monitoring service...');
    try {
      const { data: agentsData, error } = await supabase
        .from('debug_agent_monitoring')
        .select('*');

      if (error) throw error;

      agentsData?.forEach(agent => {
        this.agents.set(agent.agent_id, {
          id: agent.agent_id,
          name: agent.agent_id,
          role: 'Unknown',
          status: agent.status as 'idle' | 'processing' | 'completed' | 'error',
          lastAction: agent.last_action
        });
      });

      console.log('Initialized agents:', this.agents);
    } catch (error) {
      console.error('Error initializing agent monitoring:', error);
    }
  }

  async updateAgentStatus(
    agentId: string, 
    status: 'idle' | 'processing' | 'completed' | 'error',
    metrics?: AgentMetricsData
  ) {
    console.log(`Updating agent ${agentId} status:`, status);
    try {
      const { error } = await supabase
        .from('debug_agent_monitoring')
        .upsert({
          agent_id: agentId,
          status,
          metrics: metrics || {},
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      const agent = this.agents.get(agentId);
      if (agent) {
        agent.status = status;
        this.agents.set(agentId, agent);
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
    }
  }

  async logAgentAction(agentId: string, action: string, details: any = {}) {
    try {
      const { error } = await supabase
        .from('agent_interactions')
        .insert({
          agent_id: agentId,
          action,
          details,
          status: 'completed'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging agent action:', error);
    }
  }

  getAgentStatus(agentId: string): 'idle' | 'processing' | 'completed' | 'error' {
    return this.agents.get(agentId)?.status || 'idle';
  }

  getAllAgents(): DifyAgent[] {
    return Array.from(this.agents.values());
  }
}

export const agentMonitoringService = AgentMonitoringService.getInstance();