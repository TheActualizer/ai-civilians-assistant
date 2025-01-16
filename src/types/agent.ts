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
  agent?: string;
  message?: string;
  timestamp: string;
}

export interface AgentsPanelProps {
  onMessage: (message: string, agent: string) => Promise<void>;
  onVoiceInput: (transcript: string) => Promise<void>;
  messages: AgentMessage[];
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

export interface ApiMetric {
  endpoint: string;
  responseTime: number;
  successRate: number;
  errorCount: number;
  timestamp: string;
  service_name?: string;
  system_metrics?: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export interface ServiceHealth {
  service_name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime_percentage: number;
  resource_usage: {
    cpu: number;
    memory: number;
    network: number;
  };
  last_check: Date;
  alerts: any[];
  dependencies: string[];
}

export interface MainLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
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