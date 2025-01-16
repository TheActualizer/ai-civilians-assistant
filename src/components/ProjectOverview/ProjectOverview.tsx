import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, Activity, MessageSquare, Database, 
  Users, Zap, Bot, Network, GitBranch,
  AlertCircle, CheckCircle2, XCircle, AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { AgentsPanel } from '../Agents/AgentsPanel';
import { useToast } from "@/hooks/use-toast";

type KnowledgeBaseEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export function ProjectOverview() {
  const { toast } = useToast();
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    activeFlows: 0,
    totalAgents: 5,
    activeAgents: 0,
    successRate: 0,
    averageResponseTime: 0
  });

  const handleMessage = async (message: string, agent: string) => {
    console.log(`Handling message from ${agent}:`, message);
    const newMessage = {
      agent,
      message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    
    toast({
      title: `New message from ${agent}`,
      description: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
    });
  };

  const handleVoiceInput = async (transcript: string) => {
    console.log('Voice input received:', transcript);
    // Handle voice input processing here
  };

  const fetchKnowledgeBase = useCallback(async () => {
    console.log('Fetching knowledge base entries...');
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching knowledge base:', error);
        throw error;
      }

      console.log('Knowledge base entries loaded:', data);
      setKnowledgeBase(data || []);
    } catch (error) {
      console.error('Failed to fetch knowledge base:', error);
      setError('Failed to fetch knowledge base');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load knowledge base data"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Simulate system metrics updates
  useEffect(() => {
    const updateMetrics = () => {
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        networkLatency: Math.random() * 200,
        activeFlows: Math.floor(Math.random() * 10),
        activeAgents: Math.floor(Math.random() * 5),
        successRate: 85 + Math.random() * 10,
        averageResponseTime: 800 + Math.random() * 400
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchKnowledgeBase();
  }, [fetchKnowledgeBase]);

  const renderMetricsCard = () => (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <CardTitle className="text-gray-100">System Metrics</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Real-time performance monitoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">CPU Usage</p>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${systemMetrics.cpuUsage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{systemMetrics.cpuUsage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Memory</p>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${systemMetrics.memoryUsage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{systemMetrics.memoryUsage.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-400" />
              <p className="text-sm text-gray-300">Network Latency</p>
            </div>
            <p className="text-xl font-semibold text-blue-400 mt-1">
              {systemMetrics.networkLatency.toFixed(0)}ms
            </p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-green-400" />
              <p className="text-sm text-gray-300">Active Agents</p>
            </div>
            <p className="text-xl font-semibold text-green-400 mt-1">
              {systemMetrics.activeAgents}/{systemMetrics.totalAgents}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <p className="text-sm text-gray-300">Success Rate</p>
            </div>
            <p className="text-xl font-semibold text-emerald-400 mt-1">
              {systemMetrics.successRate.toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <p className="text-sm text-gray-300">Avg Response</p>
            </div>
            <p className="text-xl font-semibold text-yellow-400 mt-1">
              {systemMetrics.averageResponseTime.toFixed(0)}ms
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="agents" className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-1">
        <TabsTrigger value="agents">Agents</TabsTrigger>
        <TabsTrigger value="crewai">CrewAI</TabsTrigger>
        <TabsTrigger value="memory">Memory</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="realtime">Realtime</TabsTrigger>
      </TabsList>

      <div className="mt-6 space-y-6">
        <TabsContent value="agents">
          <AgentsPanel 
            onMessage={handleMessage}
            onVoiceInput={handleVoiceInput}
            messages={messages}
          />
        </TabsContent>

        <TabsContent value="crewai">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                <CardTitle className="text-gray-100">CrewAI Integration</CardTitle>
              </div>
              <CardDescription>
                Collaborative AI agents working together on complex tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderMetricsCard()}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm text-gray-100">Active Workflows</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Data Processing</span>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400">Running</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Analysis</span>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">Pending</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm text-gray-100">Agent Teams</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Analysis Team</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-400">3 Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Research Team</span>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-400">2 Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle className="text-gray-100">Memory Management</CardTitle>
              </div>
              <CardDescription>
                Knowledge base and memory statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-sm text-gray-100">Knowledge Base</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">{knowledgeBase.length}</p>
                        <p className="text-sm text-gray-400">Total Entries</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-sm text-gray-100">Categories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">
                          {new Set(knowledgeBase.map(entry => entry.category)).size}
                        </p>
                        <p className="text-sm text-gray-400">Unique Categories</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {knowledgeBase.map(entry => (
                        <div 
                          key={entry.id}
                          className="p-3 bg-gray-800/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-200">{entry.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {entry.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle className="text-gray-100">Chat Interface</CardTitle>
              </div>
              <CardDescription>
                Recent agent communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-800/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-gray-200">{msg.agent}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{msg.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No messages yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime">
          {renderMetricsCard()}
        </TabsContent>
      </div>
    </Tabs>
  );
}