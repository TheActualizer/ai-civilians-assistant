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
  performance_metrics: {
    response_time: number[];
    success_rate: number[];
    error_rate: number[];
  };
  network_stats: NetworkStats;
  analysis_status: string;
  last_analysis_timestamp: string;
  connection_status: string;
  connection_score: number;
  analysis_data: Record<string, any>;
  agent_states: Record<string, string>;
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

export interface SharedComputerState {
  id?: string;
  session_id?: string;
  screen_sharing: {
    active: boolean;
    userId: string | null;
  };
  voice_chat: {
    active: boolean;
    participants: string[];
  };
  video_chat: {
    active: boolean;
    participants: string[];
  };
  active_users: string[];
  system_metrics: SystemLoad;
  browser_state?: {
    url: string;
    title: string;
    isClaudeActive: boolean;
    lastInteraction: string;
  };
}

export interface MainLayoutProps {
  children: React.ReactNode;
}