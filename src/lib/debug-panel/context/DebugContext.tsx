import { createContext, useContext, useReducer, ReactNode } from 'react';
import { ApiCallHistoryEntry, ApiError, LightBoxResponse } from '@/components/GetStarted/types';

interface DebugState {
  isLoading: boolean;
  error: string | null;
  requestId: string | null;
  lightboxData: LightBoxResponse | null;
  apiCallHistory: ApiCallHistoryEntry[];
  apiError: ApiError | null;
}

interface DebugContextType extends DebugState {
  addToHistory: (event: string, details?: any) => void;
  setError: (error: string | null) => void;
  setRequestId: (id: string | null) => void;
  setLightboxData: (data: LightBoxResponse | null) => void;
  setApiError: (error: ApiError | null) => void;
  clearHistory: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

type DebugAction =
  | { type: 'ADD_TO_HISTORY'; payload: ApiCallHistoryEntry }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REQUEST_ID'; payload: string | null }
  | { type: 'SET_LIGHTBOX_DATA'; payload: LightBoxResponse | null }
  | { type: 'SET_API_ERROR'; payload: ApiError | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_HISTORY' };

const debugReducer = (state: DebugState, action: DebugAction): DebugState => {
  switch (action.type) {
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        apiCallHistory: [...state.apiCallHistory, action.payload],
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_REQUEST_ID':
      return { ...state, requestId: action.payload };
    case 'SET_LIGHTBOX_DATA':
      return { ...state, lightboxData: action.payload };
    case 'SET_API_ERROR':
      return { ...state, apiError: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_HISTORY':
      return { ...state, apiCallHistory: [] };
    default:
      return state;
  }
};

export const DebugProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(debugReducer, {
    isLoading: false,
    error: null,
    requestId: null,
    lightboxData: null,
    apiCallHistory: [],
    apiError: null,
  });

  const value = {
    ...state,
    addToHistory: (event: string, details?: any) => {
      console.log(`Debug Event: ${event}`, details);
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: {
          timestamp: new Date().toISOString(),
          event,
          details,
        },
      });
    },
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setRequestId: (id: string | null) => dispatch({ type: 'SET_REQUEST_ID', payload: id }),
    setLightboxData: (data: LightBoxResponse | null) => dispatch({ type: 'SET_LIGHTBOX_DATA', payload: data }),
    setApiError: (error: ApiError | null) => dispatch({ type: 'SET_API_ERROR', payload: error }),
    clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
  };

  return <DebugContext.Provider value={value}>{children}</DebugContext.Provider>;
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};