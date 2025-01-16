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
  bandwidth_usage?: number[];
  connection_pool?: number[];
  latency_history?: number[];
}

export interface PerformanceMetrics {
  response_time: number[];
  success_rate: number[];
  error_rate: number[];
  throughput?: number[];
  response_times?: number[];
}

export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  message?: string;
  timestamp: string;
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
  agent_states: Record<string, any>;
  auto_analysis_enabled?: boolean;
  analysis_interval?: number;
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
  performanceIndicators: {
    error_rate: number[];
    throughput: number[];
    response_times: number[];
  };
}

export interface MainLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export interface SiteStructurePage {
  id: string;
  page_path: string;
  title: string;
  description: string;
  hub_name: string;
  parent_path: string;
  is_active: boolean;
  requires_auth: boolean;
  page_type: string;
  metadata: Record<string, any>;
  component_data: {
    sections: any[];
    features: any[];
    integrations: any[];
  };
  created_at: string;
  updated_at: string;
}

export interface ApiMetric {
  endpoint: string;
  responseTime: number;
  successRate: number;
  errorCount: number;
  timestamp: string;
}

export interface VideoSynthesis {
  id: string;
  prompt: string;
  status: string;
  duration: number;
  segment_count: number;
  raw_segments: any[];
  synthesized_output: {
    url: string;
    duration: number;
    timestamp: string;
    quality_score: number;
  };
  generation_metrics: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}