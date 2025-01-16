import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Mic, MicOff } from "lucide-react";
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  agent: string;
  message: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onMessageSubmit: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
}

export function ChatInterface({ messages, onMessageSubmit, onVoiceInput }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [realtimeChat, setRealtimeChat] = useState<RealtimeChat | null>(null);

  const handleVoiceToggle = async () => {
    if (!isConnected) {
      try {
        const chat = new RealtimeChat((event) => {
          console.log('Realtime event:', event);
          if (event.type === 'response.audio.delta') {
            setIsSpeaking(true);
          } else if (event.type === 'response.audio.done') {
            setIsSpeaking(false);
          } else if (event.type === 'response.message' && event.message) {
            onMessageSubmit(event.message);
          }
        });
        
        await chat.init();
        setRealtimeChat(chat);
        setIsConnected(true);
        
        toast({
          title: "Voice Connected",
          description: "You can now speak with the agents",
        });
      } catch (error) {
        console.error('Error connecting voice:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect voice interface",
        });
      }
    } else {
      realtimeChat?.disconnect();
      setRealtimeChat(null);
      setIsConnected(false);
      setIsSpeaking(false);
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    onMessageSubmit(userInput);
    if (realtimeChat) {
      await realtimeChat.sendMessage(userInput);
    }
    setUserInput('');
  };

  useEffect(() => {
    return () => {
      realtimeChat?.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-gray-700 backdrop-blur-sm z-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col h-[450px] py-4">
          <div className="flex items-center justify-between gap-2 mb-4 text-gray-200">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Agent Chat</h3>
            </div>
            <Button
              variant={isConnected ? "destructive" : "secondary"}
              size="icon"
              onClick={handleVoiceToggle}
              className="w-8 h-8 p-0"
            >
              {isConnected ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <Card className="flex-1 bg-gray-800/50 border-gray-700 mb-4">
            <ScrollArea className="h-[300px]">
              <CardContent className="p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.agent === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        msg.agent === 'user'
                          ? 'bg-primary/10 text-primary-foreground ml-auto'
                          : 'bg-gray-700/50 text-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">
                          {msg.agent === 'user' ? 'You' : msg.agent}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
          
          <div className="flex gap-3">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message to the agent team..."
              className="min-h-[80px] bg-gray-800/50 border-gray-700 text-gray-100"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              onClick={handleSubmit}
              className="px-8 h-[80px] bg-primary hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}