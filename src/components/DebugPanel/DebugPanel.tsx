import { useState } from "react";
import { Terminal, RefreshCw, Send, Bug, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
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
  const [message, setMessage] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onMessageSubmit(message);
      setMessage("");
    }
  };

  return (
    <Sidebar className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[600px]'}`}>
      <SidebarContent>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
            >
              {isCollapsed ? "→" : "←"}
            </Button>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Debug Console</h2>
                {error && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Bug className="w-4 h-4 mr-1" />
                    Error
                  </Badge>
                )}
              </div>
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="text-sm text-gray-500">
                Request ID: {requestId || 'Not available'}
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  onClick={onRetry} 
                  variant="outline"
                  className="gap-2"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Retry
                </Button>
                
                <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Debug message..."
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary" className="gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </form>
              </div>

              {apiError && (
                <Card className="bg-red-50 border-red-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <CardTitle className="text-red-700">API Error</CardTitle>
                      <Badge variant="outline" className="bg-red-100 text-red-700">
                        {new Date(apiError.timestamp).toLocaleTimeString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700">{apiError.message}</p>
                    {apiError.details && (
                      <ScrollArea className="h-[100px] mt-2 rounded-md border border-red-200 bg-red-50/50 p-4">
                        <pre className="text-sm text-red-800">
                          {JSON.stringify(apiError.details, null, 2)}
                        </pre>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">API Call History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {apiCallHistory.map((entry, index) => (
                        <div 
                          key={index} 
                          className={`border-l-2 pl-4 py-2 ${
                            entry.event.includes('Error') 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-blue-500'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={entry.event.includes('Error') ? 'bg-red-100' : ''}>
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </Badge>
                            <span className={`font-medium ${entry.event.includes('Error') ? 'text-red-700' : ''}`}>
                              {entry.event}
                            </span>
                          </div>
                          {entry.details && (
                            <pre className={`mt-2 text-sm p-2 rounded overflow-auto ${
                              entry.event.includes('Error') ? 'bg-red-50' : 'bg-gray-50'
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
            </>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}