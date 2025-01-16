export type DifyAgent = {
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

export interface AgentsPanelProps {
  onMessage: (message: string, agent: string) => Promise<void>;
  onVoiceInput: (transcript: string) => Promise<void>;
  messages: Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>;
}