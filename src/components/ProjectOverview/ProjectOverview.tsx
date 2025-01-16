import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Building2, Calculator, FileText, Map, Database, 
  Code, Workflow, Brain, Network, Settings2,
  MessagesSquare, GitBranch, Bot, Zap, Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChat } from '@/utils/RealtimeAudio';

type KnowledgeBaseEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  created_at: string;
};

export function ProjectOverview() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [realtimeMessages, setRealtimeMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>>([]);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleRealtimeMessage = useCallback((event: any) => {
    console.log('Received realtime message:', event);
    
    if (event.type === 'conversation.message') {
      setRealtimeMessages(prev => [...prev, {
        role: event.message.role,
        content: event.message.content,
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  const startRealtimeSession = async () => {
    try {
      chatRef.current = new RealtimeChat(handleRealtimeMessage);
      await chatRef.current.init();
      setIsRealtimeConnected(true);
      toast({
        title: "Connected",
        description: "Realtime session started successfully",
      });
    } catch (error) {
      console.error('Error starting realtime session:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start realtime session',
        variant: "destructive",
      });
    }
  };

  const endRealtimeSession = () => {
    chatRef.current?.disconnect();
    setIsRealtimeConnected(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('knowledge_base')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          setError('Failed to load project information');
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load knowledge base data"
          });
          return;
        }

        setEntries(data || []);
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, [toast]);

  const sections = [
    {
      id: 'crew-ai',
      title: 'CrewAI System',
      icon: Brain,
      content: 'AI Crew orchestration and memory management system.'
    },
    {
      id: 'architecture',
      title: 'Architecture',
      icon: GitBranch,
      content: 'System architecture and component relationships.'
    },
    {
      id: 'memory',
      title: 'Memory System',
      icon: Database,
      content: 'Long-term and working memory management.'
    },
    {
      id: 'agents',
      title: 'AI Agents',
      icon: Bot,
      content: 'Specialized AI agents and their roles.'
    },
    {
      id: 'settings',
      title: 'Parameters',
      icon: Settings2,
      content: 'System parameters and configuration.'
    }
  ];

  sections.push({
    id: 'realtime',
    title: 'Realtime Chat',
    icon: MessagesSquare,
    content: 'Real-time conversation analysis and debugging.'
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800/40 border-gray-700">
        <CardHeader>
          <CardTitle>Loading project overview...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getEntriesByCategory = (category: string) => 
    entries.filter(entry => entry.category === category);

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700 backdrop-blur-lg shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Network className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CrewAI System Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time visualization of AI system architecture and controls
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="crew-ai" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{section.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="crew-ai">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>System Status</CardTitle>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-green-500/10 text-green-400 border-green-400/20"
                    >
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="border-gray-800 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                              <Database className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-200">Memory Store</h3>
                          </div>
                          <div className="text-3xl font-bold text-blue-400">
                            {entries.length} Entries
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="border-gray-800 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                              <Bot className="h-5 w-5 text-green-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-200">Active Agents</h3>
                          </div>
                          <div className="text-3xl font-bold text-green-400">
                            {getEntriesByCategory('agents').length}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="border-gray-800 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                              <GitBranch className="h-5 w-5 text-purple-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-200">Components</h3>
                          </div>
                          <div className="text-3xl font-bold text-purple-400">
                            {getEntriesByCategory('architecture').length}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="memory">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Database className="h-5 w-5 text-blue-400" />
                    </div>
                    <CardTitle>Memory System</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {getEntriesByCategory('memory').map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-gray-800 bg-gradient-to-br from-blue-500/5 to-purple-500/5 hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300">
                            <CardContent className="p-6">
                              <h3 className="text-lg font-medium text-gray-200 mb-2">{entry.title}</h3>
                              <p className="text-gray-400 mb-4">{entry.content}</p>
                              <div className="flex flex-wrap gap-2">
                                {entry.tags?.map(tag => (
                                  <Badge 
                                    key={tag} 
                                    variant="secondary"
                                    className="bg-blue-500/10 text-blue-400 border-blue-400/20"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="agents">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Bot className="h-5 w-5 text-green-400" />
                    </div>
                    <CardTitle>AI Agents</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {getEntriesByCategory('agents').map(agent => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Card className="border-gray-800 bg-gradient-to-br from-green-500/5 to-emerald-500/5 hover:from-green-500/10 hover:to-emerald-500/10 transition-all duration-300">
                            <CardContent className="p-6">
                              <h3 className="text-lg font-medium text-gray-200 mb-2">{agent.title}</h3>
                              <p className="text-gray-400 mb-4">{agent.content}</p>
                              <Badge variant="outline">Active</Badge>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="architecture">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <GitBranch className="h-5 w-5 text-purple-400" />
                    </div>
                    <CardTitle>System Architecture</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {getEntriesByCategory('architecture').map(entry => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Card className="border-gray-800 bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300">
                            <CardContent className="p-6">
                              <h3 className="text-lg font-medium text-gray-200 mb-2">{entry.title}</h3>
                              <p className="text-gray-400 mb-4">{entry.content}</p>
                              <div className="flex flex-wrap gap-2">
                                {entry.tags?.map(tag => (
                                  <Badge 
                                    key={tag} 
                                    variant="secondary"
                                    className="bg-purple-500/10 text-purple-400 border-purple-400/20"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-500/10 rounded-lg">
                      <Settings2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardTitle>System Parameters</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Temperature</label>
                      <Slider
                        value={[0.7]}
                        onValueChange={([value]) => {}}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">0.7</span>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Max Tokens</label>
                      <Input
                        type="number"
                        value={2000}
                        onChange={(e) => {}}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Memory Depth</label>
                      <Input
                        type="number"
                        value={5}
                        onChange={(e) => {}}
                        className="w-full"
                      />
                    </div>

                    <Button 
                      onClick={() => {}}
                      className="w-full"
                    >
                      Update Parameters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="realtime">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <MessagesSquare className="h-5 w-5 text-blue-400" />
                      </div>
                      <CardTitle>Realtime Conversation</CardTitle>
                    </div>
                    {!isRealtimeConnected ? (
                      <Button 
                        onClick={startRealtimeSession}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                      >
                        Start Session
                      </Button>
                    ) : (
                      <Button 
                        onClick={endRealtimeSession}
                        variant="destructive"
                        className="bg-red-500/20"
                      >
                        End Session
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {realtimeMessages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <Card className={`border-gray-800 ${
                            message.role === 'assistant' 
                              ? 'bg-blue-500/5 hover:bg-blue-500/10' 
                              : 'bg-green-500/5 hover:bg-green-500/10'
                          } transition-colors duration-200`}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge 
                                  variant="outline" 
                                  className={message.role === 'assistant' 
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-400/20'
                                    : 'bg-green-500/10 text-green-400 border-green-400/20'
                                  }
                                >
                                  {message.role}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-gray-300">{message.content}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
