export interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
}

export interface PerformanceMetrics {
  response_time: number[];
  success_rate: number[];
  error_rate: number[];
}

export interface NetworkStats {
  latency: number[];
  bandwidth: number[];
  connections: number[];
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
}

export interface AgentMessage {
  role: string;
  content: string;
  timestamp?: string;
}

export interface AgentMetrics {
  cpu_usage: number;
  memory_usage: number;
  response_time: number;
  success_rate: number;
  error_rate: number;
}

export interface AgentMetricsData {
  timestamp: string;
  metrics: AgentMetrics;
}

export interface DifyAgent {
  id: string;
  name: string;
  status: string;
  type: string;
}
