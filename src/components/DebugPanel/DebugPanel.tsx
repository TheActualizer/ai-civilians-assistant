import { useState, useCallback } from "react";
import { 
  Terminal, RefreshCw, Send, Bug, XCircle, AlertCircle, 
  Maximize2, Minimize2, Layout, LayoutGrid, ArrowLeft, 
  ArrowRight, ArrowDown, Rocket, CircuitBoard, Dna, Infinity,
  Upload, Paperclip
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import type { DebugPanelProps } from "./types";
import { VoiceControls } from './VoiceControls';

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
  const [position, setPosition] = useState<"right" | "left" | "bottom">("right");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [expandedFeatures, setExpandedFeatures] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      // Here you can handle the file upload
      // For now we'll just log it
    }
  };

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
    switch (position) {
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

  const cyclePosition = () => {
    const positions: ("right" | "left" | "bottom")[] = ["right", "left", "bottom"];
    const currentIndex = positions.indexOf(position);
    const nextIndex = (currentIndex + 1) % positions.length;
    setPosition(positions[nextIndex]);
  };

  const getPositionIcon = () => {
    switch (position) {
      case "left":
        return <ArrowLeft className="h-4 w-4" />;
      case "right":
        return <ArrowRight className="h-4 w-4" />;
      case "bottom":
        return <ArrowDown className="h-4 w-4" />;
    }
  };

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(prev => !prev);
    if (!isFullscreen) {
      setExpandedFeatures(true);
      setActiveTab('advanced');
    }
  }, [isFullscreen]);

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
        <div className="flex justify-between items-center">
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

        <div className="flex items-center gap-4">
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
                <VoiceControls onSpeakingChange={setIsSpeaking} />
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
            <Button 
              type="submit" 
              variant="secondary" 
              className="gap-2 bg-gray-800 hover:bg-gray-700 transition-colors"
              disabled={isSpeaking}
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </div>

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
      </>
    );
  };

  return (
    <div 
      className={`fixed transition-all duration-300 ease-in-out 
        ${isFullscreen ? 'inset-0 w-full h-full' : `${getPositionClasses()} ${
          isMinimized ? 'h-12' : position === 'bottom' ? 'h-[300px]' : 'h-screen'
        } ${isCollapsed ? 'w-16' : position === 'bottom' ? 'w-full' : 'w-[600px]'}`}
        bg-gray-900/95 backdrop-blur-sm border-gray-700/50 shadow-xl z-50
        ${!isFullscreen && (position === 'left' ? 'border-r' : position === 'right' ? 'border-l' : 'border-t')}`}
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
              onClick={handleFullscreenToggle}
              className="p-2 text-gray-400 hover:text-gray-100 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
