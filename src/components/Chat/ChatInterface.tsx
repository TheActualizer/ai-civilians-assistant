import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Mic, MicOff, Brain } from "lucide-react";
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { useToast } from "@/hooks/use-toast";
import { DifyAgent } from '@/components/Agents/types';

interface ChatMessage {
  agent: string;
  message: string;
  timestamp: string;
  role?: string;
  avatar?: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onMessageSubmit: (message: string) => void;
  onVoiceInput?: (transcript: string) => void;
  agents?: DifyAgent[];
}

export function ChatInterface({ messages, onMessageSubmit, onVoiceInput, agents = [] }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [realtimeChat, setRealtimeChat] = useState<RealtimeChat | null>(null);
  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set());

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
      try {
        await realtimeChat.sendMessage(userInput);
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send message",
        });
      }
    }
    setUserInput('');
  };

  const getAgentColor = (agentId: string) => {
    const colors = {
      'data-ingestion': 'bg-blue-500',
      'parcel-analysis': 'bg-green-500',
      'setback-calculation': 'bg-purple-500',
      'environmental': 'bg-yellow-500',
      'buildable-envelope': 'bg-red-500',
    };
    return colors[agentId as keyof typeof colors] || 'bg-gray-500';
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
              <h3 className="font-semibold">AI Agent Collaboration</h3>
            </div>
            <div className="flex items-center gap-2">
              {agents.map((agent) => (
                <Badge
                  key={agent.id}
                  variant={activeAgents.has(agent.id) ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newActiveAgents = new Set(activeAgents);
                    if (newActiveAgents.has(agent.id)) {
                      newActiveAgents.delete(agent.id);
                    } else {
                      newActiveAgents.add(agent.id);
                    }
                    setActiveAgents(newActiveAgents);
                  }}
                >
                  <Brain className="h-3 w-3 mr-1" />
                  {agent.name}
                </Badge>
              ))}
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
                        {msg.agent !== 'user' && (
                          <Avatar className={`h-6 w-6 ${getAgentColor(msg.agent)}`}>
                            <Brain className="h-4 w-4 text-white" />
                          </Avatar>
                        )}
                        <span className="text-sm font-medium">
                          {msg.agent === 'user' ? 'You' : msg.agent}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      {msg.role && (
                        <Badge variant="outline" className="mt-2">
                          {msg.role}
                        </Badge>
                      )}
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
              placeholder="Ask the AI agent team..."
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