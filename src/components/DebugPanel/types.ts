import { LightBoxResponse } from "@/components/GetStarted/types";

export interface ApiCallHistoryEntry {
  timestamp: string;
  event: string;
  details?: any;
}

export interface ApiError {
  message: string;
  details?: any;
  timestamp: string;
}

export interface DebugPanelProps {
  isLoading: boolean;
  error: string | null;
  requestId: string | null;
  lightboxData: LightBoxResponse | null;
  apiCallHistory: ApiCallHistoryEntry[];
  apiError: ApiError | null;
  onRetry: () => void;
  onMessageSubmit: (message: string) => void;
}

export type PanelPosition = "right" | "left" | "bottom";