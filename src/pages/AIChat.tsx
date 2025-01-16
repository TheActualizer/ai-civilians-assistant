import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { useSession } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DifyAgent } from '@/components/Agents/types';

interface ChatMessage {
  agent: string;
  message: string;
  timestamp: string;
  role?: string;
}

const ORCHESTRATOR: DifyAgent = {
  id: 'orchestrator',
  name: 'Orchestrator',
  role: 'Coordinates agent responses and manages conversation flow',
  status: 'idle',
  backstory: 'An expert system coordinator that ensures efficient and relevant agent collaboration.',
  systemPrompt: 'You are the orchestrator responsible for coordinating agent responses based on context.'
};

const INITIAL_AGENTS: DifyAgent[] = [
  {
    id: 'data-ingestion',
    name: 'Data Analyst',
    role: 'Processes and validates input data',
    status: 'idle',
    backstory: 'A meticulous data scientist with years of experience in processing complex datasets.',
    systemPrompt: 'You are a data processing expert focused on accuracy and validation.'
  },
  {
    id: 'parcel-analysis',
    name: 'Property Surveyor',
    role: 'Analyzes property characteristics',
    status: 'idle',
    backstory: 'A veteran land surveyor who has mapped thousands of properties.',
    systemPrompt: 'You are an expert land surveyor analyzing property details.'
  },
  {
    id: 'setback-calculation',
    name: 'Zoning Expert',
    role: 'Handles zoning and setback rules',
    status: 'idle',
    backstory: 'A precise mathematician specializing in spatial calculations and zoning regulations.',
    systemPrompt: 'You are a zoning expert calculating setbacks and requirements.'
  },
  {
    id: 'environmental',
    name: 'Environmental Scientist',
    role: 'Assesses environmental impacts',
    status: 'idle',
    backstory: 'An environmental scientist passionate about sustainable development.',
    systemPrompt: 'You are an environmental scientist evaluating ecological factors.'
  },
  {
    id: 'buildable-envelope',
    name: 'Architect',
    role: 'Determines buildable areas',
    status: 'idle',
    backstory: 'An architect with expertise in maximizing usable space while respecting constraints.',
    systemPrompt: 'You are an architect focused on optimizing buildable areas.'
  }
];

const AIChat = () => {
  const session = useSession();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agents] = useState<DifyAgent[]>([ORCHESTRATOR, ...INITIAL_AGENTS]);

  const determineRelevantAgents = (message: string) => {
    // Simple keyword matching for demo purposes
    const keywords = {
      'data': ['data-ingestion'],
      'property': ['parcel-analysis', 'buildable-envelope'],
      'zoning': ['setback-calculation'],
      'environment': ['environmental'],
      'build': ['buildable-envelope', 'setback-calculation'],
      'analysis': ['data-ingestion', 'parcel-analysis'],
      'regulation': ['setback-calculation', 'environmental']
    };

    const relevantAgentIds = new Set<string>();
    Object.entries(keywords).forEach(([keyword, agentIds]) => {
      if (message.toLowerCase().includes(keyword)) {
        agentIds.forEach(id => relevantAgentIds.add(id));
      }
    });

    return relevantAgentIds.size > 0 
      ? Array.from(relevantAgentIds)
      : INITIAL_AGENTS.map(a => a.id); // Default to all agents if no specific matches
  };

  const handleMessageSubmit = async (message: string) => {
    console.log('Processing message:', message);
    
    // Add user message
    const userMessage: ChatMessage = {
      agent: 'user',
      message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Log the chat interaction
      const { data: chatData, error: chatError } = await supabase
        .from('chat_history')
        .insert([{
          user_id: session?.user?.id,
          message: message,
          context: { agents: agents.map(a => a.id) }
        }])
        .select();

      if (chatError) throw chatError;

      // Orchestrator response
      setTimeout(() => {
        const relevantAgentIds = determineRelevantAgents(message);
        const orchestratorMessage: ChatMessage = {
          agent: ORCHESTRATOR.name,
          message: `I'll coordinate responses from our experts on this query. Based on the context, I'm engaging: ${
            relevantAgentIds.map(id => agents.find(a => a.id === id)?.name).join(', ')
          }`,
          timestamp: new Date().toISOString(),
          role: ORCHESTRATOR.role
        };
        setMessages(prev => [...prev, orchestratorMessage]);

        // Simulate relevant agent responses with different delays
        relevantAgentIds.forEach((agentId, index) => {
          const agent = agents.find(a => a.id === agentId);
          if (!agent) return;

          setTimeout(() => {
            const agentMessage: ChatMessage = {
              agent: agent.name,
              message: `From ${agent.role} perspective: Analyzing the request based on my expertise in ${agent.role.toLowerCase()}...`,
              timestamp: new Date().toISOString(),
              role: agent.role
            };
            setMessages(prev => [...prev, agentMessage]);
          }, (index + 1) * 1000); // Stagger responses
        });
      }, 500);

    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process message"
      });
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    await handleMessageSubmit(transcript);
  };

  useEffect(() => {
    // Load previous chat history
    const loadChatHistory = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading chat history:', error);
          return;
        }

        const formattedMessages: ChatMessage[] = data.map(item => ({
          agent: 'user',
          message: item.message,
          timestamp: item.created_at
        }));

        setMessages(formattedMessages);
      }
    };

    loadChatHistory();
  }, [session?.user?.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      
      <div className="container mx-auto px-4 pt-24 pb-32">
        <Card className="bg-white shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">AI Agent Collaboration Hub</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Engage with our team of specialized AI agents, coordinated by an intelligent orchestrator to provide comprehensive analysis of your property development queries.
            </p>
          </CardContent>
        </Card>
      </div>

      <ChatInterface 
        messages={messages}
        onMessageSubmit={handleMessageSubmit}
        onVoiceInput={handleVoiceInput}
        agents={agents}
      />
    </div>
  );
};

export default AIChat;