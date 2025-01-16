// Base types for metrics and stats
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

// Agent-related interfaces
export interface DifyAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  backstory: string;
  systemPrompt?: string;
  model?: string;
  progress?: number;
  documents?: string[];
  lastAction?: string;
}

export interface AgentAction {
  id: string;
  description: string;
  timestamp: string;
  agentId: string;
  status: 'pending' | 'success' | 'error';
}

export interface AgentState {
  agents: DifyAgent[];
  actions: AgentAction[];
  currentPhase: string;
  isProcessing: boolean;
}

export interface AgentMessage {
  role: string;
  content: string;
  timestamp: string;
}

// Metrics and Analysis interfaces
export interface ApiMetric {
  endpoint: string;
  service_name: string;
  response_time: number;
  success_rate: number;
  error_count: number;
  total_requests: number;
  system_metrics: SystemLoad;
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
  agent_feedback?: Record<string, any>;
  auto_analysis_enabled?: boolean;
  analysis_interval?: number;
}

export interface ServiceMetrics {
  id: string;
  name: string;
  status: string;
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

export interface EngineerMessage {
  id: string;
  message: string;
  context: string;
  message_type: string;
  importance_level: number;
  created_at: string;
  metadata: {
    mood?: string;
    energy_level?: string;
    ready_for_challenge?: boolean;
  };
  game_context: {
    challenge_level: number;
    achievement_points: number;
    current_mission: string;
    badges_earned: string[];
  };
}

export interface SiteStructurePage {
  id: string;
  path: string;
  title: string;
  description?: string;
  component_data?: Record<string, any>;
  metadata?: Record<string, any>;
  sections?: any[];
  features?: string[];
  integrations?: string[];
}