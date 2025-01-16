export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  message?: string;
  timestamp?: string;
}

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
  analysis_data: Record<string, any>;
  system_load: SystemLoad;
  performance_metrics: PerformanceMetrics;
  network_stats: NetworkStats;
  agent_states: Record<string, string>;
  connection_score: number;
}

export interface ApiMetric {
  id: string;
  service_name: string;
  endpoint: string;
  responseTime: number;
  successRate: number;
  errorCount: number;
  timestamp: string;
  performance_data?: Record<string, any>;
  system_metrics?: Record<string, any>;
}

export interface ServiceHealth {
  id: string;
  service_name: string;
  status: string;
  resource_usage: {
    cpu: number;
    memory: number;
    network: number;
  };
  uptime_percentage: number;
  last_check: string;
  alerts: any[];
  dependencies: string[];
}

export interface DualMonitorState {
  activeScreen: string;
  splitView: boolean;
  primaryContent: any;
  secondaryContent: any;
}

export interface GameState {
  score: number;
  level: number;
  achievements: string[];
  inventory: Record<string, any>;
}

export interface CommunicationSession {
  id: string;
  type: string;
  participants: string[];
  status: string;
  metadata: Record<string, any>;
}

export interface VideoSynthesis {
  id: string;
  prompt: string;
  status: string;
  synthesized_output: {
    url: string;
    duration: number;
    timestamp: string;
    quality_score: number;
  };
  metadata: {
    tags: string[];
    category: string | null;
    visual_elements: string[];
    narrative_elements: string[];
  };
}