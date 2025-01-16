import { useState, useCallback } from 'react';
import { useDebug } from '../context/DebugContext';

export const useDebugPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Changed to false to show by default
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");
  const [position, setPosition] = useState<"right" | "left" | "bottom">("right");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const debug = useDebug();

  console.log("useDebugPanel hook state:", {
    isCollapsed,
    viewMode,
    position,
    isMinimized,
    isFullscreen
  });

  const handleRetry = useCallback(() => {
    debug.addToHistory("Retry requested");
  }, [debug]);

  const handleMessageSubmit = useCallback((message: string) => {
    debug.addToHistory("Debug message sent", { message });
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