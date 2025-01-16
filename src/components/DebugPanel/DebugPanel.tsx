import { useState, useCallback, useRef, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import type { DebugPanelProps, PanelPosition, DragState } from "./types";
import { DebugHeader } from "./DebugHeader";
import { DebugControls } from "./DebugControls";
import { DebugContent } from "./DebugContent";

const MIN_WIDTH = 400;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 600;
const THROW_VELOCITY_THRESHOLD = 1.5;

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    velocity: { x: 0, y: 0 }
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
    if (isMinimized) return;
    
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState(prev => ({
      ...prev,
      isDragging: true,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      currentX: rect.left,
      currentY: rect.top
    }));

    lastPositionRef.current = { x: rect.left, y: rect.top };
    lastTimeRef.current = performance.now();
  };

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    const newX = e.clientX - dragState.startX;
    const newY = e.clientY - dragState.startY;
    
    const velocityX = (newX - lastPositionRef.current.x) / deltaTime;
    const velocityY = (newY - lastPositionRef.current.y) / deltaTime;

    setDragState(prev => ({
      ...prev,
      currentX: newX,
      currentY: newY,
      velocity: { x: velocityX, y: velocityY }
    }));

    lastPositionRef.current = { x: newX, y: newY };
    lastTimeRef.current = currentTime;
  }, [dragState]);

  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging) return;

    const { velocity } = dragState;
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

    if (speed > THROW_VELOCITY_THRESHOLD) {
      let currentX = dragState.currentX;
      let currentY = dragState.currentY;
      let velocityX = velocity.x * 100;
      let velocityY = velocity.y * 100;
      
      const animate = () => {
        velocityX *= 0.95;
        velocityY *= 0.95;
        
        currentX += velocityX;
        currentY += velocityY;

        const rect = panelRef.current?.getBoundingClientRect();
        if (rect) {
          if (currentX < 0) {
            currentX = 0;
            velocityX = -velocityX * 0.5;
          } else if (currentX + rect.width > window.innerWidth) {
            currentX = window.innerWidth - rect.width;
            velocityX = -velocityX * 0.5;
          }

          if (currentY < 0) {
            currentY = 0;
            velocityY = -velocityY * 0.5;
          } else if (currentY + rect.height > window.innerHeight) {
            currentY = window.innerHeight - rect.height;
            velocityY = -velocityY * 0.5;
          }
        }

        setDragState(prev => ({
          ...prev,
          currentX,
          currentY,
          velocity: { x: velocityX, y: velocityY }
        }));

        if (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    setDragState(prev => ({
      ...prev,
      isDragging: false
    }));
  }, [dragState]);

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dragState.isDragging, handleDrag, handleDragEnd]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File selected",
        description: `Selected file: ${file.name}`,
      });
      onMessageSubmit(`File uploaded: ${file.name}`);
    }
  };

  const toggleView = (view: string) => {
    setActiveViews(prev => 
      prev.includes(view) 
        ? prev.filter(v => v !== view)
        : [...prev, view]
    );
  };

  const getPositionClasses = () => {
    const baseClasses = "fixed transition-all duration-300 ease-in-out bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 shadow-xl z-50";
    
    if (isMinimized) return `${baseClasses} ${position === 'right' ? 'right-0' : position === 'left' ? 'left-0' : 'bottom-0'} h-12`;
    
    if (position === "floating") {
      return `${baseClasses} ${isCollapsed ? 'w-16' : `w-[${width}px]`} h-[600px] cursor-move`;
    }

    switch (position) {
      case "left":
        return `${baseClasses} left-0 h-screen border-r ${isCollapsed ? 'w-16' : `w-[${width}px]`}`;
      case "right":
        return `${baseClasses} right-0 h-screen border-r ${isCollapsed ? 'w-16' : `w-[${width}px]`}`;
      case "bottom":
        return `${baseClasses} bottom-0 w-full h-[300px] border-t`;
      default:
        return `${baseClasses} right-0`;
    }
  };

  return (
    <div
      ref={panelRef}
      className={getPositionClasses()}
      style={position === "floating" ? {
        transform: `translate(${dragState.currentX}px, ${dragState.currentY}px)`,
        transition: dragState.isDragging ? 'none' : 'transform 0.3s ease-out'
      } : undefined}
      onMouseDown={handleDragStart}
    >
      <div className="p-4 space-y-4 h-full flex flex-col">
        <DebugHeader 
          isCollapsed={isCollapsed}
          isMinimized={isMinimized}
          onCollapse={() => setIsCollapsed(!isCollapsed)}
          onMinimize={() => setIsMinimized(!isMinimized)}
          onPositionChange={() => setPosition(prev => 
            prev === "right" ? "left" : 
            prev === "left" ? "bottom" : 
            prev === "bottom" ? "floating" : "right"
          )}
          error={error}
        />

        {!isCollapsed && !isMinimized && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-400">
                Request ID: <span className="font-mono">{requestId || 'Not available'}</span>
              </div>
              <ToggleGroup 
                type="single" 
                value={viewMode}
                onValueChange={(value) => setViewMode(value as "detailed" | "compact")}
                className="border border-gray-700 rounded-lg p-1 bg-gray-800/50"
              >
                <ToggleGroupItem value="basic">Basic</ToggleGroupItem>
                <ToggleGroupItem value="advanced">Advanced</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
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

            <DebugControls 
              message={message}
              isLoading={isLoading}
              onMessageChange={setMessage}
              onMessageSubmit={onMessageSubmit}
              onRetry={onRetry}
              onFileUpload={handleFileUpload}
            />

            <DebugContent 
              activeViews={activeViews}
              viewMode={viewMode}
              apiError={apiError}
              error={error}
              apiCallHistory={apiCallHistory}
            />
          </>
        )}
      </div>
    </div>
  );
}
