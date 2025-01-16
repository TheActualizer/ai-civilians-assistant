import { Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface DebugControlsProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onMessageSubmit: (message: string) => void;
  onRetry: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DebugControls = ({
  message,
  isLoading,
  onMessageChange,
  onMessageSubmit,
  onRetry,
}: DebugControlsProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onMessageSubmit(message);
      onMessageChange("");
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the debug console",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={onRetry} 
        variant="outline"
        size="icon"
        className="shrink-0"
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
      
      <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
        <Input
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};