import { useEffect, useState } from 'react';
import { Terminal, Activity, AlertCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceControls } from "@/components/DebugPanel/VoiceControls";
import { MessageHistory } from "@/components/DebugPanel/MessageHistory";
import { GamifiedMetrics } from "@/components/DebugPanel/GamifiedMetrics";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { DebugPanelProps } from "./types";

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
  const [position, setPosition] = useState<"right" | "left" | "bottom">("right");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        const { error: logError } = await supabase
          .from('debug_logs')
          .insert({
            message: message.trim(),
            level: 'info',
            source: 'debug_console'
          });

        if (logError) throw logError;

        onMessageSubmit(message);
        setMessage("");
        
        toast({
          title: "Message Sent",
          description: "Debug message has been logged and processed",
        });
      } catch (error) {
        console.error('Error logging debug message:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send debug message"
        });
      }
    }
  };

  const getPositionClasses = () => {
    const baseClasses = isMinimized ? 'h-12' : position === 'bottom' ? 'h-[300px]' : 'h-screen';
    const widthClasses = isCollapsed ? 'w-16' : position === 'bottom' ? 'w-full' : 'w-[600px]';
    
    switch (position) {
      case "left":
        return `left-0 ${baseClasses} ${widthClasses} border-r`;
      case "right":
        return `right-0 ${baseClasses} ${widthClasses} border-l`;
      case "bottom":
        return `bottom-0 ${baseClasses} ${widthClasses} border-t`;
      default:
        return `right-0 ${baseClasses} ${widthClasses} border-l`;
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
        return <Terminal className="h-4 w-4 rotate-90" />;
      case "right":
        return <Terminal className="h-4 w-4 -rotate-90" />;
      case "bottom":
        return <Terminal className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className={`fixed transition-all duration-300 ease-in-out 
        ${getPositionClasses()} bg-gray-900/95 backdrop-blur-sm border-gray-700/50 shadow-xl z-50`}
    >
      <div className="relative p-4 space-y-4 h-full flex flex-col">
        {/* Voice Control Floating Button */}
        <div className="absolute top-4 right-4 z-50">
          <VoiceControls onSpeakingChange={setIsSpeaking} />
        </div>

        <div className="flex justify-between items-center gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
            >
              {isCollapsed ? <Terminal className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
            </Button>
            {!isCollapsed && (
              <>
                <Terminal className="h-5 w-5 text-primary" />
                <span className="font-semibold text-gray-200">Debug Console</span>
                {error && (
                  <Badge variant="destructive" className="animate-pulse">Error</Badge>
                )}
                {isSpeaking && (
                  <Badge variant="secondary" className="animate-pulse">Listening...</Badge>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={cyclePosition}
              className="p-2"
            >
              {getPositionIcon()}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2"
            >
              {isMinimized ? (
                <Terminal className="h-4 w-4" />
              ) : (
                <Terminal className="h-4 w-4 rotate-180" />
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="gamified" className="flex-1">
          <TabsList>
            <TabsTrigger value="gamified">Debug Game</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="gamified" className="flex-1">
            <GamifiedMetrics />
          </TabsContent>

          <TabsContent value="messages" className="flex-1">
            <MessageHistory />
          </TabsContent>

          <TabsContent value="system">
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">System Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Memory Usage</span>
                      <span className="text-gray-200">64%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">CPU Load</span>
                      <span className="text-gray-200">45%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type debug message or speak using the mic button..."
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
