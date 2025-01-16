import { create } from 'zustand';

interface DebugPanelState {
  isMinimized: boolean;
  isCollapsed: boolean;
  isFullscreen: boolean;
  position: 'left' | 'right' | 'bottom';
  apiCallHistory: Array<{
    type: string;
    event: string;
    data: any;
    timestamp: string;
  }>;
  viewMode: 'compact' | 'detailed';
  isLoading: boolean;
}

interface DebugPanelActions {
  setIsMinimized: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
  setIsFullscreen: (value: boolean) => void;
  setPosition: (position: 'left' | 'right' | 'bottom') => void;
  addToHistory: (entry: { type: string; event: string; data: any; timestamp: string }) => void;
  clearHistory: () => void;
  setViewMode: (mode: 'compact' | 'detailed') => void;
  setIsLoading: (value: boolean) => void;
  handleRetry: () => void;
  handleMessageSubmit: (message: string) => void;
}

const useDebugPanelStore = create<DebugPanelState & DebugPanelActions>((set, get) => ({
  isMinimized: false,
  isCollapsed: false,
  isFullscreen: false,
  position: 'right',
  apiCallHistory: [],
  viewMode: 'detailed',
  isLoading: false,
  setIsMinimized: (value) => set({ isMinimized: value }),
  setIsCollapsed: (value) => set({ isCollapsed: value }),
  setIsFullscreen: (value) => set({ isFullscreen: value }),
  setPosition: (position) => set({ position }),
  addToHistory: (entry) =>
    set((state) => ({
      apiCallHistory: [...state.apiCallHistory, entry],
    })),
  clearHistory: () => set({ apiCallHistory: [] }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsLoading: (value) => set({ isLoading: value }),
  handleRetry: () => {
    const state = get();
    console.log('Retrying last operation...');
    // Add retry logic here if needed
    set({ isLoading: true });
    setTimeout(() => set({ isLoading: false }), 1000);
  },
  handleMessageSubmit: (message: string) => {
    const state = get();
    console.log('Submitting debug message:', message);
    state.addToHistory({
      type: 'debug',
      event: 'message',
      data: { message },
      timestamp: new Date().toISOString()
    });
  }
}));

export const useDebugPanel = () => {
  const state = useDebugPanelStore();
  const actions = useDebugPanelStore();
  return { state, actions };
};