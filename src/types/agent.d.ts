import { Json } from '@/integrations/supabase/types';

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

export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  message?: string;
  timestamp?: string;
}

export interface SiteStructurePage {
  id: string;
  page_path: string;
  title: string;
  description?: string;
  component_data: {
    sections: string[];
    features: string[];
    integrations: string[];
  };
}

export interface ApiMetric {
  service_name: string;
  endpoint: string;
  response_time: number;
  success_rate: number;
  error_count: number;
  total_requests: number;
  performance_data: Record<string, any>;
}

export interface ServiceMetrics {
  service_name: string;
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

export interface MainLayoutProps {
  children: React.ReactNode;
}

export interface CommunicationSession {
  id: string;
  session_type: string;
  participants: string[];
  session_data: Record<string, any>;
}

export interface DifyAgent {
  id: string;
  name: string;
  role: string;
  backstory: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  lastAction: string;
}

export interface UIVersion {
  id: string;
  name: string;
  component_data: Record<string, any>;
  component_registry: Record<string, any>;
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

export interface VideoSynthesis {
  id: string;
  prompt: string;
  status: string;
  duration: number;
  segment_count: number;
  synthesized_output: {
    url: string;
    duration: number;
    timestamp: string;
    quality_score: number;
  };
}

export interface LogComparison {
  frontend_logs: string[];
  backend_logs: string[];
  matching_percentage: number;
}

export interface SystemAnalysis {
  id: string;
  analysis_type: string;
  insights: string[];
  metrics: Record<string, any>;
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
  performanceMetrics: PerformanceMetrics;
}

export interface NavItem {
  path: string;
  label: string;
  icon?: JSX.Element;
  children?: { path: string; label: string; }[];
}