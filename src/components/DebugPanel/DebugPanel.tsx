import { Terminal, Layout, LayoutGrid, Maximize2, Minimize2, Database, Bot, Network, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DebugHistory } from "@/lib/debug-panel/components/DebugHistory";
import { DebugControls } from "@/lib/debug-panel/components/DebugControls";
import { useDebugPanel } from "@/lib/debug-panel/hooks/useDebugPanel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export function DebugPanel() {
  const { state, actions } = useDebugPanel();

  useEffect(() => {
    // Subscribe to Supabase realtime changes for agent_interactions
    const agentChannel = supabase
      .channel('agent-debug')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_interactions' },
        (payload) => {
          console.log('Agent interaction:', payload);
          actions.addToHistory({
            type: 'supabase',
            event: 'agent_interaction',
            data: payload,
            timestamp: new Date().toISOString()
          });
        }
      )
      .subscribe();

    // Subscribe to chat history changes
    const chatChannel = supabase
      .channel('chat-debug')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_history' },
        (payload) => {
          console.log('Chat history:', payload);
          actions.addToHistory({
            type: 'supabase',
            event: 'chat_history',
            data: payload,
            timestamp: new Date().toISOString()
          });
        }
      )
      .subscribe();

    return () => {
      agentChannel.unsubscribe();
      chatChannel.unsubscribe();
    };
  }, []);

  console.log("DebugPanel mounting with state:", {
    isMinimized: state.isMinimized,
    isCollapsed: state.isCollapsed,
    position: state.position
  });

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

  if (state.isMinimized) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          variant="default"
          size="lg"
          onClick={() => actions.setIsMinimized(false)}
          className="bg-primary text-white hover:bg-primary/90 gap-2"
        >
          <Terminal className="h-5 w-5" />
          Engineering Debug Console
        </Button>
      </div>
    );
  }

  if (state.isCollapsed) return null;

  return (
    <div 
      className={`fixed transition-all duration-300 ease-in-out 
        ${state.isFullscreen ? 'inset-0 w-full h-full' : `${getPositionClasses()} ${
          state.position === 'bottom' ? 'h-[500px]' : 'h-screen'
        } ${state.isCollapsed ? 'w-16' : state.position === 'bottom' ? 'w-full' : 'w-[800px]'}`}
        bg-gray-900/95 backdrop-blur-sm border-gray-700/50 shadow-xl z-50 top-16
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
                <h2 className="font-semibold text-gray-100">Engineering Debug Console</h2>
                <Badge variant="outline" className="ml-2">DEVELOPMENT</Badge>
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

        <Tabs defaultValue="supabase" className="flex-1">
          <TabsList className="grid grid-cols-5 gap-4">
            <TabsTrigger value="supabase" className="gap-2">
              <Database className="h-4 w-4" />
              Supabase
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2">
              <Bot className="h-4 w-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="edge" className="gap-2">
              <Network className="h-4 w-4" />
              Edge Functions
            </TabsTrigger>
            <TabsTrigger value="models" className="gap-2">
              <Cpu className="h-4 w-4" />
              AI Models
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2">
              <Terminal className="h-4 w-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="supabase" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-200 mb-2">Database Operations</h3>
                  {state.apiCallHistory
                    .filter(entry => entry.type === 'supabase')
                    .map((entry, index) => (
                      <pre key={index} className="text-xs text-gray-400 mt-2 overflow-x-auto">
                        {JSON.stringify(entry, null, 2)}
                      </pre>
                    ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <DebugHistory history={state.apiCallHistory} viewMode={state.viewMode} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="edge" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <DebugControls onRetry={actions.handleRetry} onMessageSubmit={actions.handleMessageSubmit} isLoading={state.isLoading} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-2 gap-4">
                {/* Add model-specific content here */}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <ScrollArea className="h-[600px]">
              {/* Add overview content here */}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
