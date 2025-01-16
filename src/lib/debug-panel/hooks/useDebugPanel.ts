import { useState, useCallback } from 'react';
import { useDebug } from '../context/DebugContext';

export const useDebugPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");
  const [position, setPosition] = useState<"right" | "left" | "bottom">("right");
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized
  const [isFullscreen, setIsFullscreen] = useState(false);

  const debug = useDebug();

  const handleRetry = useCallback(() => {
    debug.addToHistory("Retry requested");
    // Additional retry logic can be implemented here
  }, [debug]);

  const handleMessageSubmit = useCallback((message: string) => {
    debug.addToHistory("Debug message sent", { message });
    // Additional message handling logic can be implemented here
  }, [debug]);

  return {
    state: {
      isCollapsed,
      viewMode,
      position,
      isMinimized,
      isFullscreen,
      ...debug
    },
    actions: {
      setIsCollapsed,
      setViewMode,
      setPosition,
      setIsMinimized,
      setIsFullscreen,
      handleRetry,
      handleMessageSubmit
    }
  };
};