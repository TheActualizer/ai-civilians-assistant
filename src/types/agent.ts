// ... keep existing code (up to UIVersion interface)

export interface UIVersion {
  id: string;
  name: string;
  route: string;
  component_data: Record<string, any>;
  version_type: string;
  version_tags: string[];
  performance_metrics: {
    api_latency: number[];
    render_time: number[];
    memory_usage: number[];
  };
  integration_data: {
    connected_services: string[];
    api_dependencies: string[];
    data_flow: string[];
  };
  created_at: string;
  is_active?: boolean;
  description?: string;
  metadata?: Record<string, any>;
  created_by?: string;
  parent_version_id?: string;
}

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

export interface MainLayoutProps {
  children: React.ReactNode;
}

export interface PerformanceMetrics {
  response_time: number[];
  success_rate: number[];
  error_rate: number[];
  throughput?: number[];
  response_times?: number[];
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

export interface AgentMessage {
  role: string;
  content: string;
  timestamp?: string;
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
  agent_states: Record<string, any>;
  agent_feedback?: Record<string, any>;
  auto_analysis_enabled?: boolean;
  analysis_interval?: number;
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
  status: 'idle' | 'processing' | 'completed' | 'error';
  backstory?: string;
  systemPrompt?: string;
  model?: string;
  progress?: number;
  documents?: string[];
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
  created_at: string;
  updated_at: string;
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
