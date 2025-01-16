import { useEffect, useState } from 'react';
import { Brain, Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { DifyAgent, AgentAction, AgentState } from './types';

const INITIAL_AGENTS: DifyAgent[] = [
  {
    id: 'data-ingestion',
    name: 'Data Ingestion Agent',
    role: 'Processes input data and prepares for analysis',
    status: 'idle'
  },
  {
    id: 'parcel-analysis',
    name: 'Parcel Analysis Agent',
    role: 'Analyzes property boundaries and geometry',
    status: 'idle'
  },
  {
    id: 'setback-calculation',
    name: 'Setback Calculation Agent',
    role: 'Calculates required setbacks and buffers',
    status: 'idle'
  },
  {
    id: 'environmental',
    name: 'Environmental Overlay Agent',
    role: 'Analyzes environmental constraints',
    status: 'idle'
  },
  {
    id: 'buildable-envelope',
    name: 'Buildable Envelope Agent',
    role: 'Determines buildable area',
    status: 'idle'
  },
  {
    id: 'zoning-compliance',
    name: 'Zoning Compliance Agent',
    role: 'Validates zoning requirements',
    status: 'idle'
  },
  {
    id: 'visualization',
    name: 'Visualization Agent',
    role: 'Generates visual representations',
    status: 'idle'
  },
  {
    id: 'reporting',
    name: 'Reporting Agent',
    role: 'Compiles analysis results',
    status: 'idle'
  },
  {
    id: 'error-handling',
    name: 'Error Handling Agent',
    role: 'Monitors and validates process',
    status: 'idle'
  },
  {
    id: 'orchestration',
    name: 'Orchestration Agent',
    role: 'Coordinates agent workflow',
    status: 'idle'
  }
];

export function AgentsPanel() {
  const [state, setState] = useState<AgentState>({
    agents: INITIAL_AGENTS,
    actions: [],
    currentPhase: 'initialization',
    isProcessing: false
  });

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

  const renderAgentCard = (agent: DifyAgent) => (
    <div key={agent.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
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
      {agent.lastAction && (
        <p className="text-xs text-gray-500 mt-2">
          Last action: {agent.lastAction}
        </p>
      )}
    </div>
  );

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle className="text-gray-100">Dify Agent Network</CardTitle>
          </div>
          {state.isProcessing && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400/50">
              Processing
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.agents.map(renderAgentCard)}
          </div>
          
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