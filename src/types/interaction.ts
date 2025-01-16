export interface InteractionLog {
  id: string;
  profile_id: string;
  interaction_type: string;
  component_name: string;
  details: Record<string, any>;
  metadata: Record<string, any>;
  performance_metrics: {
    execution_time?: number;
    memory_usage?: number;
    render_time?: number;
  };
  created_at: string;
  session_id?: string;
  client_info: {
    browser?: string;
    os?: string;
    device?: string;
    viewport?: {
      width: number;
      height: number;
    };
  };
}

export interface InteractionMetrics {
  componentLatency: number[];
  interactionCount: number;
  errorRate: number;
  successRate: number;
}