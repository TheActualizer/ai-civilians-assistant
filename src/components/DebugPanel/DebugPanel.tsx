import { Terminal, Layout, LayoutGrid, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DebugHistory } from "@/lib/debug-panel/components/DebugHistory";
import { DebugControls } from "@/lib/debug-panel/components/DebugControls";
import { useDebugPanel } from "@/lib/debug-panel/hooks/useDebugPanel";

export function DebugPanel() {
  const { state, actions } = useDebugPanel();

  const getPositionClasses = () => {
    switch (state.position) {
      case "left":
        return "left-0";
      case "right":
        return "right-0";
      case "bottom":
        return "bottom-0 w-full h-[300px]";
      default:
        return "right-0";
    }
  };

  if (state.isMinimized || state.isCollapsed) return null;

  return (
    <div 
      className={`fixed transition-all duration-300 ease-in-out 
        ${state.isFullscreen ? 'inset-0 w-full h-full' : `${getPositionClasses()} ${
          state.isMinimized ? 'h-12' : state.position === 'bottom' ? 'h-[300px]' : 'h-screen'
        } ${state.isCollapsed ? 'w-16' : state.position === 'bottom' ? 'w-full' : 'w-[600px]'}`}
        bg-gray-900/95 backdrop-blur-sm border-gray-700/50 shadow-xl z-50
        ${!state.isFullscreen && (state.position === 'left' ? 'border-r' : state.position === 'right' ? 'border-l' : 'border-t')}`}
    >
      <div className="p-4 space-y-4 h-full flex flex-col">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => actions.setIsCollapsed(!state.isCollapsed)}
              className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
            >
              {state.isCollapsed ? <Layout className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Button>
            {!state.isCollapsed && (
              <>
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <h2 className="font-semibold text-gray-100">Debug Console</h2>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => actions.setIsFullscreen(!state.isFullscreen)}
              className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
            >
              {state.isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <DebugControls
          onRetry={actions.handleRetry}
          onMessageSubmit={actions.handleMessageSubmit}
          isLoading={state.isLoading}
        />

        <DebugHistory
          history={state.apiCallHistory}
          viewMode={state.viewMode}
        />
      </div>
    </div>
  );
}