import { Terminal, Bug, Maximize2, Minimize2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DebugHeaderProps {
  isCollapsed: boolean;
  isMinimized: boolean;
  onCollapse: () => void;
  onMinimize: () => void;
  onPositionChange: () => void;
  error: string | null;
}

export const DebugHeader = ({
  isCollapsed,
  isMinimized,
  onCollapse,
  onMinimize,
  onPositionChange,
  error
}: DebugHeaderProps) => {
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onCollapse}
          className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
        >
          {isCollapsed ? <Terminal className="h-4 w-4" /> : <Bug className="h-4 w-4" />}
        </Button>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Terminal className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="font-semibold text-gray-100">Advanced Debug Console</h2>
            {error && (
              <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-300 rounded-full animate-pulse">
                Error Detected
              </span>
            )}
          </motion.div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPositionChange}
          className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
        >
          <Move className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMinimize}
          className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};