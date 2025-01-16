export interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
}

export interface AgentMetricsData {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeFlows: number;
  successRate: number;
  totalInteractions: number;
  system_load: {
    cpu_threads: number[];
    io_operations: number[];
    memory_allocation: number[];
  };
  networkMetrics: {
    bandwidth_usage: number[];
    connection_pool: number[];
    latency_history: number[];
  };
  performanceIndicators: {
    error_rate: number[];
    throughput: number[];
    response_times: number[];
  };
}

export interface ThreadAnalysis {
  id: string;
  page_path: string;
  thread_type: string;
  system_load: SystemLoad;
  performance_metrics: {
    response_time: number[];
    success_rate: number[];
    error_rate: number[];
  };
  network_stats: {
    latency: number[];
    bandwidth: number[];
    connections: number[];
  };
  analysis_status: string;
  last_analysis_timestamp: string;
  connection_status: string;
  connection_score: number;
  analysis_data: Record<string, any>;
  agent_states: Record<string, string>;
}

export interface AgentMessage {
  role: string;
  content: string;
  timestamp: string;
  agent?: string;
  message?: string;
}

export interface SiteStructurePage {
  id: string;
  page_path: string;
  title: string;
  description?: string;
  hub_name?: string;
  parent_path?: string;
  is_active: boolean;
  requires_auth: boolean;
  page_type: string;
  metadata: Record<string, any>;
  component_data: {
    sections: any[];
    features: any[];
    integrations: any[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface SystemAnalysis {
  metrics: Record<string, any>;
  patterns: Record<string, any>;
  insights: string[];
  correlations: any[];
  predictions: any[];
  recommendations: any[];
}