import { supabase } from "@/integrations/supabase/client";
import type { DifyAgent, AgentAction } from '@/components/Agents/types';

export type FlowContext = {
  priority: number;
  retryCount: number;
  maxRetries: number;
  timeout: number;
  dependencies: string[];
  subscribers: string[];
};

export async function initializeAgentFlow(
  agent: DifyAgent, 
  action: string, 
  details: any = {}
) {
  console.log(`Initializing flow for agent ${agent.id}:`, { action, details });
  
  try {
    const { data: interaction, error } = await supabase.rpc('log_agent_interaction', {
      agent_id: agent.id,
      action,
      details
    });

    if (error) throw error;
    
    console.log('Agent flow initialized:', interaction);
    return interaction;
  } catch (error) {
    console.error('Error initializing agent flow:', error);
    throw error;
  }
}

export async function subscribeToAgentUpdates(
  agentId: string, 
  callback: (payload: any) => void
) {
  console.log('Subscribing to agent updates:', agentId);
  
  const channel = supabase
    .channel('agent-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'agent_interactions',
        filter: `agent_id=eq.${agentId}`
      },
      (payload) => {
        console.log('Received agent update:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    console.log('Unsubscribing from agent updates:', agentId);
    supabase.removeChannel(channel);
  };
}

export async function queryAgentContext(query: string, threshold = 0.7, limit = 5) {
  console.log('Querying agent context:', { query, threshold, limit });
  
  try {
    // First, get embedding for the query
    const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke(
      'generate-embedding',
      {
        body: { text: query }
      }
    );

    if (embeddingError) throw embeddingError;

    // Search across knowledge base using the embedding
    const { data: results, error: searchError } = await supabase.rpc(
      'search_agent_context',
      {
        query_embedding: embeddingData.embedding,
        match_threshold: threshold,
        match_count: limit
      }
    );

    if (searchError) throw searchError;

    console.log('Agent context query results:', results);
    return results;
  } catch (error) {
    console.error('Error querying agent context:', error);
    throw error;
  }
}