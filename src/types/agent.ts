export interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
}

export interface NetworkStats {
  latency: number[];
  bandwidth: number[];
  connections: number[];
}

export interface PerformanceMetrics {
  response_time: number[];
  success_rate: number[];
  error_rate: number[];
}

export interface AgentMetricsData {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeFlows: number;
  successRate: number;
  totalInteractions: number;
  system_load: SystemLoad;
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

export interface AgentMessage {
  role: string;
  content: string;
  timestamp: string;
  agent?: string;
  message?: string;
}

export interface ThreadAnalysis {
  id: string;
  page_path: string;
  thread_type: string;
  system_load: SystemLoad;
  performance_metrics: PerformanceMetrics;
  network_stats: NetworkStats;
  analysis_status: string;
  last_analysis_timestamp: string;
  connection_status: string;
  connection_score: number;
  analysis_data: Record<string, any>;
  agent_states: Record<string, string>;
}

export interface ServiceMetrics {
  id: string;
  service_name: string;
  service_type: string;
  status: string;
  health_score: number;
  performance_metrics: {
    response_times: number[];
    error_rates: number[];
    throughput: number[];
    resource_usage: {
      cpu: number[];
      memory: number[];
      network: number[];
    };
  };
}

export interface DifyAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  backstory?: string;
  systemPrompt?: string;
  model?: string;
  progress?: number;
  documents?: string[];
  lastAction?: string;
}