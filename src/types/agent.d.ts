export interface CommunicationSession {
  id: string;
  session_type: 'video' | 'audio' | 'screen_share';
  participants: string[];
  session_data: {
    room_id?: string;
    stream_ids?: string[];
    settings?: {
      video?: boolean;
      audio?: boolean;
      screen?: boolean;
    };
  };
  started_at: string;
  ended_at?: string;
  metrics: {
    bandwidth_usage: number[];
    quality_metrics: {
      video_quality?: number;
      audio_quality?: number;
      latency?: number;
    };
    participant_stats: {
      id: string;
      connection_quality: number;
      speaking_time: number;
    }[];
  };
  created_at: string;
  updated_at: string;
}

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
  system_load: SystemLoad;
  performance_metrics: PerformanceMetrics;
  network_stats: NetworkStats;
  analysis_status: string;
  last_analysis_timestamp: string;
  connection_status: string;
  connection_score: number;
  analysis_data: Record<string, any>;
  agent_states: Record<string, any>;
}

export interface SiteStructurePage {
  id: string;
  page_path: string;
  title: string;
  description?: string;
  hub_name?: string;
  component_data: {
    sections: Array<{
      title: string;
      content: string;
    }>;
    features: Array<{
      title: string;
      description: string;
    }>;
    integrations: string[];
  };
  layout_type?: string;
  page_category?: string;
}

export interface MainLayoutProps {
  children: React.ReactNode;
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
  dependencies: string[];
}

export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  message?: string;
  timestamp?: string;
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
}

export interface UIVersion {
  id: string;
  name: string;
  description?: string;
  route: string;
  component_data: Record<string, any>;
  component_registry: Record<string, any>;
  version_type: string;
  feature_list: string[];
  integration_points: string[];
  performance_metrics: {
    api_latency: number[];
    render_time: number[];
    memory_usage: number[];
  };
}

export interface PageVersion {
  version_id: string;
  version_name: string;
  route: string;
  components: any;
  implementation_details: Record<string, any>;
  layout_type: string;
  page_category: string;
  integration_points: string[];
  component_registry: Record<string, any>;
}

export interface AgentMetricsData {
  id: string;
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeFlows: number;
  successRate: number;
  totalInteractions: number;
}

export interface DifyAgent {
  id: string;
  name: string;
  role: string;
  backstory: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  lastAction: string;
}
