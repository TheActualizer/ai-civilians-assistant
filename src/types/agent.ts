export interface AgentMetricsData {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeFlows: number;
  successRate: number;
  totalInteractions: number;
  systemLoad: {
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

export interface AgentMessage {
  agent: string;
  message: string;
  timestamp: string;
}

export interface AgentAction {
  id: string;
  description: string;
  timestamp: string;
  agentId?: string;
  status?: 'success' | 'error' | 'warning';
}

export interface AgentState {
  agents: DifyAgent[];
  actions: AgentAction[];
  currentPhase: string;
  isProcessing: boolean;
}

export interface DifyAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress?: number;
  lastAction?: string;
  backstory?: string;
  documents?: string[];
  systemPrompt?: string;
  model?: 'claude' | 'gemini' | 'gemini-vision' | 'grok' | 'perplexity' | 'skyvern';
}

export interface AgentsPanelProps {
  onMessage: (message: string, agent: string) => Promise<void>;
  onVoiceInput: (transcript: string) => Promise<void>;
  messages: AgentMessage[];
  className?: string;
}