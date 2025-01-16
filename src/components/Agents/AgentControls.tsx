import { Activity, Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoiceControls } from "@/components/DebugPanel/VoiceControls";

interface AgentControlsProps {
  isProcessing: boolean;
  isSpeaking: boolean;
  onSpeakingToggle: () => void;
  onSpeakingChange: (speaking: boolean) => void;
}

export const AgentControls = ({ 
  isProcessing, 
  isSpeaking, 
  onSpeakingToggle,
  onSpeakingChange 
}: AgentControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="outline" 
        size="lg"
        className={`rounded-full p-4 transition-all duration-200 ${
          isSpeaking ? 'bg-green-500/20 border-green-500' : 'hover:bg-primary/20'
        }`}
        onClick={onSpeakingToggle}
      >
        <Mic className={`h-6 w-6 ${isSpeaking ? 'text-green-500 animate-pulse' : 'text-primary'}`} />
        <span className="sr-only">Toggle voice input</span>
      </Button>
      <VoiceControls onSpeakingChange={onSpeakingChange} />
      {isProcessing && (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400/50">
          Processing
        </Badge>
      )}
    </div>
  );
};