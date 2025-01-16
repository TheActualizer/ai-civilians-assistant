import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2, Calculator, FileText, Map, DatabaseIcon, 
  Code, Workflow, Brain, Network, Settings2,
  MessagesSquare, GitBranch, Bot
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type KnowledgeBaseEntry = Database['public']['Tables']['knowledge_base']['Row'];

export function ProjectOverview() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [memoryDepth, setMemoryDepth] = useState(5);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (err) {
        console.error('Error fetching knowledge base:', err);
        setError('Failed to load project information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, []);

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

  if (isLoading) {
    return <div>Loading project overview...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const handleParameterUpdate = () => {
    console.log('Updating parameters:', { temperature, maxTokens, memoryDepth });
    // Here we would update the CrewAI system parameters
  };

  return (
    <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <CardTitle className="text-gray-100">CrewAI System Overview</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Interactive visualization of the AI system architecture and controls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="crew-ai" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{section.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="crew-ai">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle>CrewAI System</CardTitle>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 bg-gray-800/50">
                      <h3 className="text-sm font-medium mb-2">Memory Store</h3>
                      <div className="text-2xl font-bold text-primary">
                        {entries.length} Entries
                      </div>
                    </Card>
                    <Card className="p-4 bg-gray-800/50">
                      <h3 className="text-sm font-medium mb-2">Active Agents</h3>
                      <div className="text-2xl font-bold text-primary">4</div>
                    </Card>
                    <Card className="p-4 bg-gray-800/50">
                      <h3 className="text-sm font-medium mb-2">Tasks Queue</h3>
                      <div className="text-2xl font-bold text-primary">2</div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <CardTitle>System Architecture</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-[400px] border border-gray-700 rounded-lg p-4">
                  {/* Architecture visualization would go here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Network className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                      <p>Interactive architecture visualization</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memory">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>Memory System</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {entries.map(entry => (
                      <div key={entry.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <h3 className="text-lg font-medium text-gray-100">{entry.title}</h3>
                        <p className="mt-2 text-gray-400">{entry.content}</p>
                        <div className="mt-4 flex gap-2">
                          {entry.tags && entry.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle>AI Agents</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {['Task Planner', 'Memory Manager', 'Execution Agent', 'Quality Control'].map((agent) => (
                    <Card key={agent} className="p-4 bg-gray-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{agent}</h3>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <CardTitle>System Parameters</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature</label>
                    <Slider
                      value={[temperature]}
                      onValueChange={([value]) => setTemperature(value)}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-400">{temperature}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Tokens</label>
                    <Input
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Memory Depth</label>
                    <Input
                      type="number"
                      value={memoryDepth}
                      onChange={(e) => setMemoryDepth(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={handleParameterUpdate}
                    className="w-full"
                  >
                    Update Parameters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}