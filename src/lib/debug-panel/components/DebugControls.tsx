import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Send } from "lucide-react";
import { useState } from "react";

interface DebugControlsProps {
  onRetry: () => void;
  onMessageSubmit: (message: string) => void;
  isLoading: boolean;
}

export const DebugControls = ({ onRetry, onMessageSubmit, isLoading }: DebugControlsProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onMessageSubmit(message);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button 
        onClick={onRetry} 
        variant="outline"
        className="gap-2 border-gray-700 hover:border-primary/50 hover:bg-primary/10 transition-colors"
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Retry
      </Button>
      
      <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Debug message..."
          className="flex-1 bg-gray-800/50 border-gray-700 focus:border-primary/50 transition-colors"
        />
        <Button 
          type="submit" 
          variant="secondary" 
          className="gap-2 bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Send className="h-4 w-4" />
          Send
        </Button>
      </form>
    </div>
  );
};