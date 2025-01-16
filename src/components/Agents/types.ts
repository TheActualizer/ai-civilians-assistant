export interface DifyAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  lastAction?: string;
  progress?: number;
}

export interface AgentAction {
  id: string;
  agentId: string;
  type: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'error';
  result?: any;
}

export interface AgentState {
  agents: DifyAgent[];
  actions: AgentAction[];
  currentPhase: string;
  isProcessing: boolean;
}