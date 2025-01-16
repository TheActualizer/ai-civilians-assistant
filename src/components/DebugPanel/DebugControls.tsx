import { RefreshCw, Send, Upload, Paperclip } from "lucide-react";
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
  onFileUpload
}: DebugControlsProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onMessageSubmit(message);
      toast({
        title: "Debug Message Sent",
        description: "Your message has been logged to the debug console",
      });
    }
  };

  return (
    <div className="flex items-center gap-4 mb-4">
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
        <div className="flex-1 flex gap-2 relative">
          <Input
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Debug message..."
            className="flex-1 bg-gray-800/50 border-gray-700 focus:border-primary/50 transition-colors pr-24"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer p-1.5 hover:bg-gray-700/50 rounded-md transition-colors"
            >
              <Paperclip className="h-4 w-4 text-gray-400 hover:text-gray-200" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={onFileUpload}
              />
            </label>
          </div>
        </div>
        <Button type="submit" variant="secondary" className="gap-2 bg-gray-800 hover:bg-gray-700 transition-colors">
          <Send className="h-4 w-4" />
          Send
        </Button>
      </form>
    </div>
  );
};