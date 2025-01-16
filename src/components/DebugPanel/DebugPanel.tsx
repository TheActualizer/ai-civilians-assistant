import { useState, useCallback, useRef, useEffect, memo } from "react";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import type { DebugPanelProps, PanelPosition } from "./types";
import { DebugHeader } from "./DebugHeader";
import { DebugControls } from "./DebugControls";
import { DebugContent } from "./DebugContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

const MIN_WIDTH = 350;
const MAX_WIDTH = 600;
const MIN_HEIGHT = 400;
const MAX_HEIGHT = 800;

export function DebugPanel({
  isLoading,
  error,
  requestId,
  lightboxData,
  apiCallHistory,
  apiError,
  onRetry,
  onMessageSubmit,
}: DebugPanelProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");
  const [activeViews, setActiveViews] = useState<string[]>(["history", "error", "request"]);
  const [position, setPosition] = useState<PanelPosition>("right");
  const [isMinimized, setIsMinimized] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleView = useCallback((view: string) => {
    setActiveViews(prev => 
      prev.includes(view) 
        ? prev.filter(v => v !== view)
        : [...prev, view]
    );
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [apiCallHistory]);

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-6 w-[400px] max-w-[calc(100vw-3rem)] bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-40 overflow-hidden"
          style={{
            maxHeight: `${MAX_HEIGHT}px`,
            minHeight: `${MIN_HEIGHT}px`,
          }}
        >
          <div className="flex flex-col h-full">
            <DebugHeader 
              isCollapsed={isCollapsed}
              isMinimized={isMinimized}
              onCollapse={() => setIsCollapsed(!isCollapsed)}
              onMinimize={() => setIsMinimized(!isMinimized)}
              onPositionChange={() => {}}
              error={error}
            />

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <ToggleGroup 
                  type="single" 
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value as "detailed" | "compact")}
                  className="border rounded-lg p-1 bg-background/50"
                >
                  <ToggleGroupItem value="detailed">Detailed</ToggleGroupItem>
                  <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
                </ToggleGroup>

                <div className="flex flex-wrap gap-2">
                  <Toggle 
                    pressed={activeViews.includes('history')} 
                    onPressedChange={() => toggleView('history')}
                    className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                  >
                    History
                  </Toggle>
                  <Toggle 
                    pressed={activeViews.includes('error')} 
                    onPressedChange={() => toggleView('error')}
                    className="data-[state=on]:bg-red-500/20 data-[state=on]:text-red-400"
                  >
                    Errors
                  </Toggle>
                  <Toggle 
                    pressed={activeViews.includes('request')} 
                    onPressedChange={() => toggleView('request')}
                    className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400"
                  >
                    Request
                  </Toggle>
                </div>

                <DebugContent 
                  activeViews={activeViews}
                  viewMode={viewMode}
                  apiError={apiError}
                  error={error}
                  apiCallHistory={apiCallHistory}
                />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background/50">
              <DebugControls 
                message={message}
                isLoading={isLoading}
                onMessageChange={setMessage}
                onMessageSubmit={onMessageSubmit}
                onRetry={onRetry}
                onFileUpload={() => {}}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}