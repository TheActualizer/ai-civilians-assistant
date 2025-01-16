import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Activity, MessageSquare, Database, 
  Users, Zap, Bot, Network, GitBranch,
  AlertCircle, CheckCircle2, XCircle 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { AgentsPanel } from '../Agents/AgentsPanel';

type KnowledgeBaseEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export function ProjectOverview() {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>>([]);

  const handleMessage = async (message: string, agent: string) => {
    const newMessage = {
      agent,
      message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleVoiceInput = async (transcript: string) => {
    console.log('Voice input received:', transcript);
    // Handle voice input processing here
  };

  const fetchKnowledgeBase = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setKnowledgeBase(data);
    } catch (error) {
      setError('Failed to fetch knowledge base');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKnowledgeBase();
  }, [fetchKnowledgeBase]);

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
              <div className="text-gray-400 text-center py-8">
                CrewAI integration coming soon...
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
                Manage and utilize memory for enhanced AI performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-center py-8">
                Memory management features coming soon...
              </div>
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
                Engage in conversations with AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-center py-8">
                Chat features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-gray-100">Real-time Updates</CardTitle>
              </div>
              <CardDescription>
                Monitor real-time updates from agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-center py-8">
                Real-time features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
