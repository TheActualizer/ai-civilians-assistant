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

export interface ThreadAnalysis {
  id: string;
  page_path: string;
  thread_type: string;
  connection_status: string;
  analysis_data: Record<string, any>;
  system_load: SystemLoad;
  performance_metrics: PerformanceMetrics;
  network_stats: NetworkStats;
  agent_states: Record<string, string>;
  agent_feedback: Record<string, any>;
  connection_score: number;
}

export interface LogComparison {
  metrics: Record<string, any>;
  patterns: string[];
  anomalies: string[];
  recommendations: string[];
}
