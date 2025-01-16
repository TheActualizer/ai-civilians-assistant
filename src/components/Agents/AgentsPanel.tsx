import { useEffect, useState } from 'react';
import { Brain, Activity, AlertCircle, Settings, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VoiceControls } from "@/components/DebugPanel/VoiceControls";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
    id: 'environmental',
    name: 'Environmental Overlay Agent',
    role: 'Analyzes environmental constraints',
    status: 'idle',
    backstory: 'An environmental scientist passionate about balancing development with conservation.',
    systemPrompt: 'You are an environmental scientist. Your role is to analyze environmental constraints for development.',
    model: 'claude'
  },
  {
    id: 'buildable-envelope',
    name: 'Buildable Envelope Agent',
    role: 'Determines buildable area',
    status: 'idle',
    backstory: 'An architect with expertise in maximizing usable space while respecting constraints.',
    systemPrompt: 'You are an architect. Your role is to determine the buildable area for properties.',
    model: 'claude'
  }
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
      console.log(`Calling ${agent.model || 'claude'} compute for agent:`, agent.name);
      
      if (agent.model === 'gemini' || agent.model === 'gemini-vision') {
        const { data, error } = await supabase.functions.invoke('gemini-compute', {
          body: {
            messages: [{ role: 'user', content: message }],
            systemPrompt: agent.systemPrompt || `You are ${agent.name}. ${agent.backstory}`,
            multimodal: agent.model === 'gemini-vision'
          }
        });

        if (error) {
          console.error('Error calling Gemini compute:', error);
          throw error;
        }

        console.log('Gemini compute response:', data);
        return data.content;
      } else if (agent.model === 'grok') {
        const { data, error } = await supabase.functions.invoke('grok-compute', {
          body: {
            messages: [{ role: 'user', content: message }],
            systemPrompt: agent.systemPrompt || `You are ${agent.name}. ${agent.backstory}`
          }
        });

        if (error) {
          console.error('Error calling Grok compute:', error);
          throw error;
        }

        console.log('Grok compute response:', data);
        return data.content;
      } else {
        const { data, error } = await supabase.functions.invoke('claude-compute', {
          body: {
            messages: [{ role: 'user', content: message }],
            systemPrompt: agent.systemPrompt || `You are ${agent.name}. ${agent.backstory}`
          }
        });

        if (error) {
          console.error('Error calling Claude compute:', error);
          throw error;
        }

        console.log('Claude compute response:', data);
        return data.content[0].text;
      }
    } catch (error) {
      console.error('Error in handleCompute:', error);
      toast({
        title: "Error",
        description: `Failed to process with ${agent.model || 'AI'}. Please try again.`,
        variant: "destructive"
      });
      throw error;
    }
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

  const renderAgentCard = (agent: DifyAgent) => (
    <div 
      key={agent.id} 
      className="p-4 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors cursor-pointer"
      onClick={() => setSelectedAgent(agent)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className={`h-5 w-5 ${getStatusColor(agent.status)}`} />
          <h3 className="font-medium text-gray-200">{agent.name}</h3>
        </div>
        <Badge 
          variant={agent.status === 'completed' ? 'default' : 'secondary'}
          className={`${getStatusColor(agent.status)}`}
        >
          {agent.status}
        </Badge>
      </div>
      <p className="text-sm text-gray-400 mb-2">{agent.role}</p>
      {agent.progress !== undefined && (
        <Progress value={agent.progress} className="h-1" />
      )}
      <div className="flex items-center justify-between mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAgent(agent);
          }}
        >
          <Settings className="h-4 w-4 mr-1" />
          Configure
        </Button>
        {agent.documents && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-300"
          >
            <FileText className="h-4 w-4 mr-1" />
            View Docs
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle className="text-gray-100">AI Agent Network</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <VoiceControls onSpeakingChange={handleSpeakingChange} />
            {state.isProcessing && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400/50">
                Processing
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.agents.map(renderAgentCard)}
          </div>
          
          {selectedAgent && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">Configure Agent</Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-gray-100">
                <DialogHeader>
                  <DialogTitle>{selectedAgent.name} Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Backstory</h4>
                    <p className="text-sm text-gray-400">{selectedAgent.backstory}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Custom Instructions</h4>
                    <Textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Enter custom instructions for this agent..."
                      className="h-32"
                    />
                  </div>
                  <Button onClick={handleCustomInstructions}>
                    Update Instructions
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {state.actions.length > 0 && (
            <div className="mt-8 border-t border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Recent Actions</h3>
              <div className="space-y-2">
                {state.actions.map((action) => (
                  <div 
                    key={action.id}
                    className="flex items-center gap-2 text-sm p-2 rounded-md bg-gray-800/30"
                  >
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{action.description}</span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
