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
}

const useDebugPanelStore = create<DebugPanelState & DebugPanelActions>((set) => ({
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
}));

export const useDebugPanel = () => {
  const state = useDebugPanelStore();
  return {
    state,
    actions: {
      setIsMinimized: useDebugPanelStore.getState().setIsMinimized,
      setIsCollapsed: useDebugPanelStore.getState().setIsCollapsed,
      setIsFullscreen: useDebugPanelStore.getState().setIsFullscreen,
      setPosition: useDebugPanelStore.getState().setPosition,
      addToHistory: useDebugPanelStore.getState().addToHistory,
      clearHistory: useDebugPanelStore.getState().clearHistory,
      setViewMode: useDebugPanelStore.getState().setViewMode,
      setIsLoading: useDebugPanelStore.getState().setIsLoading,
    },
  };
};