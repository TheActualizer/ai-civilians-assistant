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
  connection_status: string;
  analysis_status: string;
  analysis_data: any;
  system_load: SystemLoad;
  performance_metrics: PerformanceMetrics;
  network_stats: NetworkStats;
  agent_states: {
    pro: string;
    claude: string;
    gemini: string;
  };
  last_analysis_timestamp: string;
  connection_score?: number;
}

export interface AgentMetricsData {
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
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeFlows: number;
  successRate: number;
  totalInteractions: number;
}

export interface AgentMessage {
  role: string;
  content: string;
  timestamp?: string;
  agent?: string;
  message?: string;
}

export interface DifyAgent {
  id: string;
  name: string;
  status: "idle" | "processing" | "completed" | "error";
  capabilities?: string[];
  lastAction?: string;
  metrics?: AgentMetricsData;
  role?: string;
  backstory?: string;
  systemPrompt?: string;
  model?: string;
  progress?: number;
  documents?: boolean;
}

export interface AgentAction {
  id: string;
  description: string;
  timestamp: string;
  agentId: string;
  status: 'success' | 'error' | 'pending';
}

export interface AgentState {
  agents: DifyAgent[];
  actions: AgentAction[];
  currentPhase?: string;
  isProcessing?: boolean;
}

export interface AgentsPanelProps {
  onMessage: (message: string, agent: string) => Promise<void>;
  onVoiceInput?: (transcript: string) => void;
  messages: AgentMessage[];
}