import { useState } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializeAgentFlow, queryAgentContext, subscribeToAgentUpdates } from '@/utils/agentFlow';
import { ClaudeAnalysis } from './ClaudeAnalysis';
import { AgentMetrics } from './AgentMetrics';
import { AgentNetwork } from './AgentNetwork';
import { AgentCard } from './AgentCard';
import { AgentControls } from './AgentControls';
import { AgentDialog } from './AgentDialog';
import type { DifyAgent, AgentAction, AgentState, AgentsPanelProps } from './types';

const INITIAL_AGENTS: DifyAgent[] = [
  {
    id: 'data-ingestion',
    name: 'Data Ingestion Agent',
    role: 'Processes input data and prepares for analysis',
    status: 'idle',
    backstory: 'A meticulous data scientist with years of experience in processing complex datasets.',
    systemPrompt: 'You are a data processing expert. Your role is to clean, validate, and prepare data for analysis.',
    model: 'gemini'
  },
  {
    id: 'parcel-analysis',
    name: 'Parcel Analysis Agent',
    role: 'Analyzes property boundaries and geometry',
    status: 'idle',
    backstory: 'A veteran land surveyor who has mapped thousands of properties across the country.',
    systemPrompt: 'You are an expert land surveyor. Your role is to analyze property boundaries and geometric characteristics.',
    model: 'gemini-vision'
  },
  {
    id: 'setback-calculation',
    name: 'Setback Calculation Agent',
    role: 'Calculates required setbacks and buffers',
    status: 'idle',
    backstory: 'A precise mathematician specializing in spatial calculations and zoning regulations.',
    systemPrompt: 'You are a zoning expert. Your role is to calculate required setbacks and buffers for properties.',
    model: 'grok'
  },
  {
    id: 'computer-assistant',
    name: 'Computer Assistant Agent',
    role: 'Assists with computer-related tasks and automation',
    status: 'idle',
    backstory: 'An AI assistant with deep knowledge of computer systems and automation capabilities.',
    systemPrompt: 'You are a computer expert. Your role is to assist with computer-related tasks and automation.',
    model: 'claude'
  },
];

export function AgentsPanel({ onMessage, onVoiceInput, messages }: AgentsPanelProps) {
  const { toast } = useToast();
  const [state, setState] = useState<AgentState>({
    agents: INITIAL_AGENTS,
    actions: [],
    currentPhase: 'initialization',
    isProcessing: false
  });
  const [selectedAgent, setSelectedAgent] = useState<DifyAgent | null>(null);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCompute = async (message: string, agent: DifyAgent) => {
    try {
      const flowId = await initializeAgentFlow(agent, 'compute', { message });
      console.log(`Initialized flow ${flowId} for agent:`, agent.name);

      const context = await queryAgentContext(message);
      console.log('Retrieved context for computation:', context);

      const unsubscribe = await subscribeToAgentUpdates(agent.id, (update) => {
        console.log(`Received update for agent ${agent.name}:`, update);
        setState(prev => ({
          ...prev,
          agents: prev.agents.map(a => 
            a.id === agent.id 
              ? { ...a, status: update.new.status }
              : a
          )
        }));
      });

      const response = await handleModelCompute(agent, message, context);
      console.log(`Compute response from ${agent.model}:`, response);

      unsubscribe();

      return response;
    } catch (error) {
      console.error('Error in handleCompute:', error);
      throw error;
    }
  };

  const handleModelCompute = async (
    agent: DifyAgent, 
    message: string, 
    context: any[]
  ) => {
    const systemPrompt = `${agent.systemPrompt || `You are ${agent.name}. ${agent.backstory}`}\n\nRelevant context:\n${
      context.map(c => `${c.content} (${c.source})`).join('\n')
    }`;

    if (agent.model === 'claude') {
      console.log('Calling claude-compute for agent:', agent.name);
      const { data, error } = await supabase.functions.invoke('claude-compute', {
        body: {
          messages: [{ role: 'user', content: message }],
          systemPrompt
        }
      });

      if (error) {
        console.error('Error calling claude-compute:', error);
        throw error;
      }

      return data.content;
    }

    const functionName = `${agent.model || 'claude'}-compute`;
    console.log(`Calling ${functionName} for agent:`, agent.name);

    const { data, error } = await supabase.functions.invoke(functionName, {
      body: {
        messages: [{ role: 'user', content: message }],
        systemPrompt,
        multimodal: agent.model === 'gemini-vision'
      }
    });

    if (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }

    return agent.model === 'perplexity' 
      ? data.choices[0].message.content 
      : data.content;
  };

  const handleCustomInstructions = async () => {
    if (!selectedAgent) return;
    
    setState(prev => ({
      ...prev,
      agents: prev.agents.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, status: 'processing' }
          : agent
      )
    }));

    try {
      const response = await handleCompute(customInstructions, selectedAgent);
      await onMessage(response, selectedAgent.name);

      const newAction: AgentAction = {
        id: crypto.randomUUID(),
        description: `Processed instructions for ${selectedAgent.name}`,
        timestamp: new Date().toISOString(),
        agentId: selectedAgent.id,
        status: 'success'
      };

      setState(prev => ({
        ...prev,
        actions: [newAction, ...prev.actions],
        agents: prev.agents.map(agent => 
          agent.id === selectedAgent.id 
            ? { ...agent, status: 'completed' }
            : agent
        )
      }));

      toast({
        title: "Instructions Processed",
        description: `${selectedAgent.name} has processed the instructions.`,
      });
    } catch (error) {
      console.error('Error processing instructions:', error);
      
      setState(prev => ({
        ...prev,
        agents: prev.agents.map(agent => 
          agent.id === selectedAgent.id 
            ? { ...agent, status: 'error' }
            : agent
        )
      }));
    }
  };

  const getStatusColor = (status: DifyAgent['status']) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const handleSpeakingChange = (speaking: boolean) => {
    setIsSpeaking(speaking);
    if (speaking) {
      toast({
        title: "Agent is speaking",
        description: "Listening to agent response...",
      });
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle className="text-gray-100">AI Agent Network</CardTitle>
          </div>
          <AgentControls 
            isProcessing={state.isProcessing}
            isSpeaking={isSpeaking}
            onSpeakingToggle={() => setIsSpeaking(!isSpeaking)}
            onSpeakingChange={handleSpeakingChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="claude-analysis">Claude Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AgentMetrics />
          </TabsContent>

          <TabsContent value="metrics">
            <div className="space-y-4">
              <AgentMetrics />
              <AgentNetwork />
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.agents.map(agent => (
                  <AgentCard 
                    key={agent.id}
                    agent={agent}
                    onSelect={setSelectedAgent}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="network">
            <AgentNetwork />
          </TabsContent>

          <TabsContent value="logs">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {state.actions.map((action) => (
                  <div 
                    key={action.id}
                    className="flex items-center gap-2 text-sm p-2 rounded-md bg-gray-800/30"
                  >
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{action.description}</span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="claude-analysis">
            <ClaudeAnalysis pageRoute="ai-civil-engineer" agentState={state} />
          </TabsContent>
        </Tabs>

        <AgentDialog
          agent={selectedAgent}
          customInstructions={customInstructions}
          onInstructionsChange={setCustomInstructions}
          onInstructionsSubmit={handleCustomInstructions}
        />
      </CardContent>
    </Card>
  );
}
