export type DifyAgent = {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress?: number;
  lastAction?: string;
  backstory?: string;
  documents?: string[];
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