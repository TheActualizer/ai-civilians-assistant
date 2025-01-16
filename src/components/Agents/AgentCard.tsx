import { Brain, Settings, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { DifyAgent } from './types';

interface AgentCardProps {
  agent: DifyAgent;
  onSelect: (agent: DifyAgent) => void;
  getStatusColor: (status: DifyAgent['status']) => string;
}

export const AgentCard = ({ agent, onSelect, getStatusColor }: AgentCardProps) => {
  return (
    <div 
      key={agent.id} 
      className="p-4 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors cursor-pointer"
      onClick={() => onSelect(agent)}
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
            onSelect(agent);
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
};