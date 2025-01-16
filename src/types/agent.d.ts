export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  message?: string;
  timestamp?: string;
}

export interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
}

export interface AgentMetricsData {
  id: string;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
  active_flows: number;
  success_rate: number;
  total_interactions: number;
  metrics_data: Record<string, any>;
  created_at: string;
  system_load: SystemLoad;
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

export interface ThreadAnalysis {
  id: string;
  page_path: string;
  thread_type: string;
  connection_status: string;
  analysis_data: Record<string, any>;
  suggested_connections: any[];
  claude_feedback: string | null;
  connection_score: number;
  created_at: string;
  updated_at: string;
  analysis_status: string;
  last_analysis_timestamp: string | null;
  analysis_frequency: number;
  agent_feedback: Record<string, any>;
  auto_analysis_enabled: boolean;
  analysis_interval: number;
  last_agent_sync: string;
  system_load: SystemLoad;
  agent_states: Record<string, string>;
  performance_metrics: {
    error_rate: number[];
    success_rate: number[];
    response_time: number[];
  };
  network_stats: {
    latency: number[];
    bandwidth: number[];
    connections: number[];
  };
}