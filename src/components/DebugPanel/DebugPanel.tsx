import { useState, useCallback, useRef, useEffect, memo } from "react";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import type { DebugPanelProps, PanelPosition, DragState } from "./types";
import { DebugHeader } from "./DebugHeader";
import { DebugControls } from "./DebugControls";
import { DebugContent } from "./DebugContent";
import { ResizableHandle } from "@/components/ui/resizable";

const MIN_WIDTH = 400;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 600;
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 800;
const DEFAULT_HEIGHT = 600;
const THROW_VELOCITY_THRESHOLD = 1.5;

// Memoized ResizeHandle component for better performance
const ResizeHandle = memo(({ position, onMouseDown, className }: { 
  position: string;
  onMouseDown: () => void;
  className: string;
}) => (
  <ResizableHandle 
    className={className}
    onMouseDown={onMouseDown}
  />
));

ResizeHandle.displayName = 'ResizeHandle';

// Memoized base classes to prevent recalculation
const BASE_CLASSES = "fixed transition-all duration-300 ease-in-out bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 shadow-xl z-50";

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
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    velocity: { x: 0, y: 0 }
  });
  const [isResizing, setIsResizing] = useState(false);

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

  const handleResize = useCallback((e: MouseEvent, direction: string) => {
    if (!isResizing || !panelRef.current) return;

    const rect = panelRef.current.getBoundingClientRect();
    let newWidth = width;
    let newHeight = height;

    if (direction.includes('e')) {
      newWidth = Math.min(Math.max(MIN_WIDTH, e.clientX - rect.left), MAX_WIDTH);
    }
    if (direction.includes('w')) {
      newWidth = Math.min(Math.max(MIN_WIDTH, rect.right - e.clientX), MAX_WIDTH);
    }
    if (direction.includes('s')) {
      newHeight = Math.min(Math.max(MIN_HEIGHT, e.clientY - rect.top), MAX_HEIGHT);
    }
    if (direction.includes('n')) {
      newHeight = Math.min(Math.max(MIN_HEIGHT, rect.bottom - e.clientY), MAX_HEIGHT);
    }

    requestAnimationFrame(() => {
      setWidth(newWidth);
      setHeight(newHeight);
    });
  }, [isResizing, width, height]);

  const startResize = useCallback((direction: string) => {
    setIsResizing(true);
    const handleMouseMove = (e: MouseEvent) => handleResize(e, direction);
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleResize]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File selected",
        description: `Selected file: ${file.name}`,
      });
      onMessageSubmit(`File uploaded: ${file.name}`);
    }
  }, [toast, onMessageSubmit]);

  const toggleView = useCallback((view: string) => {
    setActiveViews(prev => 
      prev.includes(view) 
        ? prev.filter(v => v !== view)
        : [...prev, view]
    );
  }, []);

  const getPositionClasses = useCallback(() => {
    if (isMinimized) {
      return `${BASE_CLASSES} ${position === 'right' ? 'right-0' : position === 'left' ? 'left-0' : 'bottom-0'} h-12`;
    }
    
    if (position === "floating") {
      return `${BASE_CLASSES} cursor-move`;
    }

    switch (position) {
      case "left":
        return `${BASE_CLASSES} left-0 h-screen border-r`;
      case "right":
        return `${BASE_CLASSES} right-0 h-screen border-r`;
      case "bottom":
        return `${BASE_CLASSES} bottom-0 w-full border-t`;
      default:
        return `${BASE_CLASSES} right-0`;
    }
  }, [position, isMinimized]);

  const resizeHandles = position === "floating" && !isMinimized && !isCollapsed ? (
    <>
      <ResizeHandle 
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" 
        onMouseDown={() => startResize('ne')}
      />
      <ResizeHandle 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" 
        onMouseDown={() => startResize('se')}
      />
      <ResizeHandle 
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" 
        onMouseDown={() => startResize('sw')}
      />
      <ResizeHandle 
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" 
        onMouseDown={() => startResize('nw')}
      />
      <ResizeHandle 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 cursor-n-resize" 
        onMouseDown={() => startResize('n')}
      />
      <ResizeHandle 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 cursor-s-resize" 
        onMouseDown={() => startResize('s')}
      />
      <ResizeHandle 
        className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 cursor-w-resize" 
        onMouseDown={() => startResize('w')}
      />
      <ResizeHandle 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 cursor-e-resize" 
        onMouseDown={() => startResize('e')}
      />
    </>
  ) : null;

  return (
    <div
      ref={panelRef}
      className={getPositionClasses()}
      style={{
        ...position === "floating" ? {
          transform: `translate(${dragState.currentX}px, ${dragState.currentY}px)`,
          transition: dragState.isDragging ? 'none' : 'transform 0.3s ease-out',
          width: isCollapsed ? 64 : width,
          height: isMinimized ? 48 : height
        } : {
          width: isCollapsed ? 64 : width
        }
      }}
      onMouseDown={handleDragStart}
    >
      {resizeHandles}
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
                <ToggleGroupItem value="detailed">Detailed</ToggleGroupItem>
                <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
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
