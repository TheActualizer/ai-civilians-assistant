export interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
}

export interface AgentMetricsData {
  system_load: SystemLoad;
  performance_metrics: {
    response_time: number[];
    success_rate: number[];
    error_rate: number[];
  };
}

export interface AgentMessage {
  role: string;
  content: string;
  agent?: string;
  timestamp?: string;
}

export interface ThreadAnalysis {
  id: string;
  page_path: string;
  thread_type: string;
  system_load: SystemLoad;
  performance_metrics: {
    response_time: number[];
    success_rate: number[];
    error_rate: number[];
  };
  analysis_data: Record<string, any>;
  agent_states: Record<string, string>;
  connection_score: number;
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
  browser_state: Record<string, any>;
  system_load: SystemLoad;
}

export interface SystemAnalysis {
  id: string;
  analysis_type: string;
  analysis_layer: string;
  insights: string[];
  metrics: Record<string, any>;
  patterns: Record<string, any>;
  correlations: string[];
  predictions: string[];
  recommendations: string[];
}

export interface DifyAgent {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  backstory?: string;
  systemPrompt?: string;
  model?: string;
  progress?: number;
  documents?: boolean;
}

export interface SiteStructurePage {
  id: string;
  page_path: string;
  title: string;
  description: string;
  hub_name: string;
  parent_path: string;
  is_active: boolean;
  requires_auth: boolean;
  page_type: string;
  metadata: Record<string, any>;
  component_data: {
    sections: any[];
    features: any[];
    integrations: any[];
  };
  created_at: string;
  updated_at: string;
}