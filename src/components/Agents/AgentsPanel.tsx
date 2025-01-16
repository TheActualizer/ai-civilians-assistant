import { useEffect, useState } from 'react';
import { Brain, Activity, AlertCircle, Settings, FileText, Network, Cpu, Database, Workflow } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceControls } from "@/components/DebugPanel/VoiceControls";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializeAgentFlow, queryAgentContext, subscribeToAgentUpdates } from '@/utils/agentFlow';
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
    model: 'perplexity'
  },
  {
    id: 'buildable-envelope',
    name: 'Buildable Envelope Agent',
    role: 'Determines buildable area',
    status: 'idle',
    backstory: 'An architect with expertise in maximizing usable space while respecting constraints.',
    systemPrompt: 'You are an architect. Your role is to determine the buildable area for properties.',
    model: 'skyvern'
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
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    activeFlows: 0
  });

  useEffect(() => {
    // Simulate system metrics updates
    const interval = setInterval(() => {
      setSystemMetrics({
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        networkLatency: Math.random() * 200,
        activeFlows: Math.floor(Math.random() * 10)
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCompute = async (message: string, agent: DifyAgent) => {
    try {
      // Initialize agent flow
      const flowId = await initializeAgentFlow(agent, 'compute', { message });
      console.log(`Initialized flow ${flowId} for agent:`, agent.name);

      // Query relevant context
      const context = await queryAgentContext(message);
      console.log('Retrieved context for computation:', context);

      // Subscribe to agent updates
      const unsubscribe = await subscribeToAgentUpdates(agent.id, (update) => {
        console.log(`Received update for agent ${agent.name}:`, update);
        // Update local state based on agent updates
        setState(prev => ({
          ...prev,
          agents: prev.agents.map(a => 
            a.id === agent.id 
              ? { ...a, status: update.new.status }
              : a
          )
        }));
      });

      // Call the appropriate compute function based on the model
      const response = await handleModelCompute(agent, message, context);
      console.log(`Compute response from ${agent.model}:`, response);

      // Clean up subscription
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

  const renderMetricsCard = () => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">CPU Usage</p>
            <Progress value={systemMetrics.cpuUsage} className="h-2 mt-1" />
            <p className="text-xs text-gray-500 mt-1">{systemMetrics.cpuUsage.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Memory</p>
            <Progress value={systemMetrics.memoryUsage} className="h-2 mt-1" />
            <p className="text-xs text-gray-500 mt-1">{systemMetrics.memoryUsage.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Network Latency: {systemMetrics.networkLatency.toFixed(0)}ms</span>
          <span>Active Flows: {systemMetrics.activeFlows}</span>
        </div>
      </CardContent>
    </Card>
  );

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
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderMetricsCard()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    Network Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Active Connections: {state.agents.filter(a => a.status === 'processing').length}</p>
                    <p className="text-sm text-gray-400">Total Agents: {state.agents.length}</p>
                    <p className="text-sm text-gray-400">Recent Actions: {state.actions.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Knowledge Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Indexed Documents: 1,234</p>
                    <p className="text-sm text-gray-400">Last Updated: 2 minutes ago</p>
                    <p className="text-sm text-gray-400">Active Queries: 3</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <div className="space-y-4">
              {renderMetricsCard()}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" />
                    Flow Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Successful Flows</p>
                        <p className="text-2xl font-bold text-green-400">89%</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Average Response Time</p>
                        <p className="text-2xl font-bold text-blue-400">1.2s</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.agents.map(renderAgentCard)}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="logs">
            <ScrollArea className="h-[500px]">
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
            </ScrollArea>
          </TabsContent>
        </Tabs>

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
      </CardContent>
    </Card>
  );
}
