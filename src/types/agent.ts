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
  system_metrics: {
    cpu: number;
    memory: number;
    network: number;
  };
  browser_state?: {
    url: string;
    title: string;
    isClaudeActive: boolean;
    lastInteraction: string;
  };
}

export interface DebugPanelState {
  isCollapsed: boolean;
  position: 'right' | 'left' | 'bottom';
  isMinimized: boolean;
  activeTab: string;
  messages: AgentMessage[];
  systemHealth: {
    cpu: number;
    memory: number;
    network: number;
    lastUpdate: string;
  };
  threadAnalysis: ThreadAnalysis | null;
}

export interface EnterpriseDebugFeatures {
  aiAssistance: boolean;
  realTimeMetrics: boolean;
  advancedLogging: boolean;
  systemOptimization: boolean;
  threadManagement: boolean;
  performanceAnalytics: boolean;
}

export interface DebugConsoleConfig {
  features: EnterpriseDebugFeatures;
  theme: 'light' | 'dark' | 'system';
  autoAnalysis: boolean;
  refreshInterval: number;
  maxLogRetention: number;
  aiModel: string;
}

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
