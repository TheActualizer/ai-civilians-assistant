import { useState, useCallback, useRef, useEffect } from "react";
import { 
  Terminal, RefreshCw, Send, Bug, XCircle, AlertCircle, 
  Maximize2, Minimize2, Layout, LayoutGrid, ArrowLeft, 
  ArrowRight, ArrowDown, Rocket, CircuitBoard, Dna, Infinity,
  Upload, Paperclip, GripVertical, Move
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import type { DebugPanelProps, PanelPosition, DragState } from "./types";

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
  const [message, setMessage] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");
  const [activeViews, setActiveViews] = useState<string[]>(["history", "error", "request"]);
  const [position, setPosition] = useState<PanelPosition>("right");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
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
    if (isFullscreen) return;
    
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition("floating");
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
    
    // Calculate velocity (pixels per millisecond)
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
      // Animate the throw
      let currentX = dragState.currentX;
      let currentY = dragState.currentY;
      let velocityX = velocity.x * 100; // Scale up for more visible effect
      let velocityY = velocity.y * 100;
      
      const animate = () => {
        velocityX *= 0.95; // Decay factor
        velocityY *= 0.95;
        
        currentX += velocityX;
        currentY += velocityY;

        // Bounce off viewport boundaries
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onMessageSubmit(message);
      setMessage("");
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
    const baseClasses = "fixed transition-all duration-300 ease-in-out bg-gray-900/95 backdrop-blur-sm border-gray-700/50 shadow-xl z-50";
    
    if (isFullscreen) return `${baseClasses} inset-0 w-full h-full`;
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

  const renderAdvancedControls = () => (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <Button
        variant="outline"
        className="flex items-center gap-2 h-20 bg-gray-900/50 hover:bg-primary/20 transition-all"
        onClick={() => console.log("Advanced analysis initiated")}
      >
        <Rocket className="h-6 w-6 text-primary animate-pulse" />
        <div className="text-left">
          <div className="font-semibold">Advanced Analysis</div>
          <div className="text-xs text-gray-400">Deep system inspection</div>
        </div>
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2 h-20 bg-gray-900/50 hover:bg-blue-500/20 transition-all"
        onClick={() => console.log("Precision debugging enabled")}
      >
        <CircuitBoard className="h-6 w-6 text-blue-400 animate-pulse" />
        <div className="text-left">
          <div className="font-semibold">Precision Debug</div>
          <div className="text-xs text-gray-400">Microsecond accuracy</div>
        </div>
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2 h-20 bg-gray-900/50 hover:bg-green-500/20 transition-all"
        onClick={() => console.log("Pattern analysis started")}
      >
        <Dna className="h-6 w-6 text-green-400 animate-pulse" />
        <div className="text-left">
          <div className="font-semibold">Pattern Analysis</div>
          <div className="text-xs text-gray-400">Complex pattern detection</div>
        </div>
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2 h-20 bg-gray-900/50 hover:bg-purple-500/20 transition-all"
        onClick={() => console.log("Quantum analysis initiated")}
      >
        <Infinity className="h-6 w-6 text-purple-400 animate-pulse" />
        <div className="text-left">
          <div className="font-semibold">Quantum Analysis</div>
          <div className="text-xs text-gray-400">State prediction engine</div>
        </div>
      </Button>
    </div>
  );

  const renderContent = () => {
    if (isMinimized || isCollapsed) return null;

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">
            Request ID: <span className="font-mono">{requestId || 'Not available'}</span>
          </div>
          <ToggleGroup 
            type="single" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'basic' | 'advanced')}
            className="border border-gray-700 rounded-lg p-1 bg-gray-800/50"
          >
            <ToggleGroupItem value="basic">Basic</ToggleGroupItem>
            <ToggleGroupItem value="advanced">Advanced</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {activeTab === 'advanced' && renderAdvancedControls()}

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

        <div className="flex items-center gap-4 mb-4">
          <Button 
            onClick={onRetry} 
            variant="outline"
            className="gap-2 border-gray-700 hover:border-primary/50 hover:bg-primary/10 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Retry
          </Button>
          
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <div className="flex-1 flex gap-2 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Debug message..."
                className="flex-1 bg-gray-800/50 border-gray-700 focus:border-primary/50 transition-colors pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer p-1.5 hover:bg-gray-700/50 rounded-md transition-colors"
                >
                  <Paperclip className="h-4 w-4 text-gray-400 hover:text-gray-200" />
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
            <Button type="submit" variant="secondary" className="gap-2 bg-gray-800 hover:bg-gray-700 transition-colors">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          {activeViews.includes('error') && apiError && (
            <Card className="bg-red-900/20 border-red-800/50 transition-colors hover:bg-red-900/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <CardTitle className="text-red-300">API Error</CardTitle>
                  <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-700">
                    {new Date(apiError.timestamp).toLocaleTimeString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-300">{apiError.message}</p>
                {apiError.details && viewMode === "detailed" && (
                  <ScrollArea className="h-[100px] mt-2 rounded-md border border-red-800/30 bg-red-900/10 p-4">
                    <pre className="text-sm font-mono text-red-300">
                      {JSON.stringify(apiError.details, null, 2)}
                    </pre>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          )}

          {activeViews.includes('history') && (
            <Card className="bg-gray-800/40 border-gray-700 transition-colors hover:bg-gray-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">API Call History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {apiCallHistory.map((entry, index) => (
                      <div 
                        key={index} 
                        className={`border-l-2 pl-4 py-2 transition-colors ${
                          entry.event.includes('Error') 
                            ? 'border-red-500 bg-red-900/20 hover:bg-red-900/30' 
                            : 'border-primary bg-gray-800/40 hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={entry.event.includes('Error') 
                              ? 'bg-red-900/30 border-red-700' 
                              : 'bg-primary/10 border-primary/50'
                            }
                          >
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </Badge>
                          <span className={`font-medium ${
                            entry.event.includes('Error') 
                              ? 'text-red-300' 
                              : 'text-gray-300'
                          }`}>
                            {entry.event}
                          </span>
                        </div>
                        {entry.details && viewMode === "detailed" && (
                          <pre className={`mt-2 text-sm p-2 rounded-md font-mono ${
                            entry.event.includes('Error') 
                              ? 'bg-red-900/10 text-red-300' 
                              : 'bg-gray-800/60 text-gray-300'
                          }`}>
                            {JSON.stringify(entry.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </>
    );
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
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
            >
              {isCollapsed ? <Layout className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Button>
            {!isCollapsed && (
              <>
                <Terminal className="h-5 w-5 text-primary animate-pulse" />
                <h2 className="font-semibold text-gray-100">Advanced Debug Console</h2>
                {error && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Bug className="w-4 h-4 mr-1" />
                    Error
                  </Badge>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPosition(prev => 
                prev === "right" ? "left" : 
                prev === "left" ? "bottom" : 
                prev === "bottom" ? "floating" : "right"
              )}
              className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
            >
              <Move className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
