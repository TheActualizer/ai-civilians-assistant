import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { cn } from "@/lib/utils";
import type { VoiceControlsProps } from './types';

export function VoiceControls({ onSpeakingChange }: VoiceControlsProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Voice event received:', event);
    
    if (event.type === 'response.audio.delta') {
      setIsProcessing(true);
      onSpeakingChange(true);
    } else if (event.type === 'response.audio.done') {
      setIsProcessing(false);
      onSpeakingChange(false);
    }
  };

  const startConversation = async () => {
    try {
      console.log('Initializing voice conversation...');
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Voice Connected",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error starting voice conversation:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : 'Failed to start voice chat',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    console.log('Ending voice conversation...');
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsProcessing(false);
    onSpeakingChange(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <Button
      variant={isConnected ? "destructive" : "default"}
      size="lg"
      onClick={isConnected ? endConversation : startConversation}
      className={cn(
        "relative h-16 w-16 rounded-full p-0 shadow-lg transition-all duration-300",
        isConnected && "bg-red-500 hover:bg-red-600",
        !isConnected && "bg-primary hover:bg-primary/90",
        "hover:scale-105 active:scale-95",
        "animate-in fade-in-50 duration-300"
      )}
    >
      <div className="relative">
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-white/20" />
          </div>
        )}
        {isConnected ? (
          <MicOff className="h-8 w-8 text-white" />
        ) : (
          <Mic className="h-8 w-8 text-white" />
        )}
      </div>
      {isProcessing && (
        <Loader2 className="absolute inset-0 h-full w-full animate-spin opacity-40" />
      )}
    </Button>
  );
}