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

export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  message?: string;
  timestamp?: string;
}

export interface ThreadAnalysis {
  id: string;
  page_path: string;
  thread_type: string;
  connection_status: string;
  analysis_status: string;
  analysis_data: Record<string, any>;
  system_load: SystemLoad;
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
  agent_states: {
    pro: string;
    claude: string;
    gemini: string;
  };
  last_analysis_timestamp: string;
  connection_score?: number;
}
