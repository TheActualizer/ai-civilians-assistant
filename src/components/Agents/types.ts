export type DifyAgent = {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress?: number;
  last_action?: string;
  backstory?: string;
  documents?: string[];
  systemPrompt?: string;
  model?: 'claude' | 'gemini' | 'gemini-vision' | 'grok' | 'perplexity' | 'skyvern';
};

export type AgentAction = {
  id: string;
  description: string;
  timestamp: string;
  agentId?: string;
  status?: 'success' | 'error' | 'warning';
};

export type AgentState = {
  agents: DifyAgent[];
  actions: AgentAction[];
  currentPhase: string;
  isProcessing: boolean;
};

export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  message?: string;
  timestamp?: string;
}

export interface AgentMetricsData {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
  active_flows: number;
  success_rate: number;
  total_interactions: number;
  system_load: {
    cpu_threads: number[];
    io_operations: number[];
    memory_allocation: number[];
  };
  network_metrics: {
    bandwidth_usage: number[];
    connection_pool: number[];
    latency_history: number[];
  };
  performance_indicators: {
    error_rate: number[];
    throughput: number[];
    response_times: number[];
  };
}

export interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
}

export interface ThreadAnalysis {
  id: string;
  page_path: string;
  thread_type: string;
  connection_status: string;
  analysis_status: string;
  analysis_data: Record<string, any>;
  system_load: SystemLoad;
  performance_metrics: {
    response_time: number[];
    success_rate: number[];
    error_rate: number[];
  };
  network_stats: {
    latency: number[];
    bandwidth: number[];
    connections: number[];
  };
  agent_states: {
    pro: string;
    claude: string;
    gemini: string;
  };
  last_analysis_timestamp: string;
  connection_score?: number;
}

export interface SharedComputerState {
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
}

export interface AgentsPanelProps {
  onMessage: (message: string, agent: string) => Promise<void>;
  onVoiceInput: (transcript: string) => Promise<void>;
  messages: AgentMessage[];
}