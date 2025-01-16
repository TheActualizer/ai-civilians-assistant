export interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
  cpu_threads?: number[];
  io_operations?: number[];
  memory_allocation?: number[];
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
  system_load: SystemLoad;
  performance_metrics: PerformanceMetrics;
  network_stats: NetworkStats;
  analysis_status: string;
  last_analysis_timestamp: string;
  connection_status?: string;
  connection_score: number;
  analysis_data: Record<string, any>;
  agent_states: Record<string, string>;
}

export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  message?: string;
  timestamp?: string;
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

export interface ApiMetric {
  id: string;
  service_name: string;
  endpoint: string;
  response_time: number;
  success_rate: number;
  error_count: number;
  total_requests: number;
  performance_data: Record<string, any>;
  system_metrics: SystemLoad;
}

export interface DifyAgent {
  id: string;
  name: string;
  role: string;
  status: string;
  backstory?: string;
  systemPrompt?: string;
  model?: string;
  progress?: number;
  documents?: string[];
}

export interface AgentMetricsData {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeFlows: number;
  successRate: number;
  totalInteractions: number;
  system_load: SystemLoad;
  networkMetrics: NetworkStats;
  performanceIndicators: PerformanceMetrics;
}

export interface SharedComputerState {
  session_id: string;
  screen_sharing: {
    active: boolean;
    userId: string | null;
    resolution?: string;
  };
  voice_chat: {
    active: boolean;
    participants: string[];
    quality?: string;
  };
  video_chat: {
    active: boolean;
    participants: string[];
    quality?: string;
  };
  active_users: string[];
  system_metrics: SystemLoad;
}