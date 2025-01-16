export interface DebugPanelProps {
  isOpen?: boolean;
  isLoading: boolean;
  error: string | null;
  requestId: string | null;
  lightboxData: any | null;
  apiCallHistory: Array<{
    timestamp: string;
    event: string;
    details?: any;
  }>;
  apiError: {
    message: string;
    details?: any;
    timestamp: string;
  } | null;
  onRetry: () => void;
  onMessageSubmit: (message: string) => void;
}

export type PanelPosition = 'left' | 'right';