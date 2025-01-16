import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { DifyAgent } from './types';

interface AgentDialogProps {
  agent: DifyAgent | null;
  customInstructions: string;
  onInstructionsChange: (value: string) => void;
  onInstructionsSubmit: () => void;
}

export const AgentDialog = ({
  agent,
  customInstructions,
  onInstructionsChange,
  onInstructionsSubmit
}: AgentDialogProps) => {
  if (!agent) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Configure Agent</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-gray-100">
        <DialogHeader>
          <DialogTitle>{agent.name} Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Backstory</h4>
            <p className="text-sm text-gray-400">{agent.backstory}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Custom Instructions</h4>
            <Textarea
              value={customInstructions}
              onChange={(e) => onInstructionsChange(e.target.value)}
              placeholder="Enter custom instructions for this agent..."
              className="h-32"
            />
          </div>
          <Button onClick={onInstructionsSubmit}>
            Update Instructions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};