import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";
import { AgentsPanel } from "@/components/Agents/AgentsPanel";
import { PropertyTab } from "@/components/ParcelDetails/PropertyTab";
import { AddressTab } from "@/components/ParcelDetails/AddressTab";
import { AdditionalTab } from "@/components/ParcelDetails/AdditionalTab";
import { ParsedTab } from "@/components/ParcelDetails/ParsedTab";
import { RawTab } from "@/components/ParcelDetails/RawTab";
import { DocumentUpload } from "@/components/ParcelDetails/DocumentUpload";
import type { LightBoxResponse } from "@/components/GetStarted/types";
import { Skeleton } from "@/components/ui/skeleton";

const AICivilEngineer = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>>([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [lightboxData, setLightboxData] = useState<LightBoxResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [apiCallHistory, setApiCallHistory] = useState<Array<{
    timestamp: string;
    event: string;
    details?: any;
  }>>([]);
  const [apiError, setApiError] = useState<{
    message: string;
    details?: any;
    timestamp: string;
  } | null>(null);

  // New state for agent interactions
  const [agentMessages, setAgentMessages] = useState<Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>>([]);

  const addToHistory = (event: string, details?: any) => {
    console.log(`API Event: ${event}`, details);
  };

  const handleAgentMessage = async (message: string, agent: string) => {
    console.log(`Agent ${agent} received message:`, message);
    
    setMessages(prev => [...prev, {
      agent,
      message,
      timestamp: new Date().toISOString()
    }]);

    // Store message in chat history
    try {
      const { error } = await supabase
        .from('chat_history')
        .insert([{
          message: userInput,
          response: message,
          context: { agent }
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing chat message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to store chat message"
      });
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    console.log('Voice input received:', transcript);
    setUserInput(transcript);
    await handleSubmit(transcript);
  };

  const handleSubmit = async (input: string = userInput) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setMessages(prev => [...prev, {
      agent: 'user',
      message: input,
      timestamp: new Date().toISOString()
    }]);

    try {
      // Clear input after sending
      setUserInput('');
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process message"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    // Add your retry logic here
  };

  useEffect(() => {
    // Fetch latest property request logic here
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Navbar session={session} />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Navbar session={session} />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <SidebarProvider>
        <div className="flex flex-col w-full min-h-[calc(100vh-4rem)]">
          <div className="flex-1 pt-16 px-6 pb-8">
            <div className="mb-8">
              <AgentsPanel 
                onMessage={handleAgentMessage}
                onVoiceInput={handleVoiceInput}
                messages={agentMessages}
              />
            </div>

            <Tabs defaultValue="property" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-1">
                <TabsTrigger value="property">Property</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="additional">Additional</TabsTrigger>
                <TabsTrigger value="parsed">Parsed</TabsTrigger>
                <TabsTrigger value="raw">Raw</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-6">
                <TabsContent value="property">
                  <PropertyTab lightboxData={lightboxData} />
                </TabsContent>

                <TabsContent value="address">
                  <AddressTab lightboxData={lightboxData} />
                </TabsContent>

                <TabsContent value="additional">
                  <AdditionalTab lightboxData={lightboxData} />
                </TabsContent>

                <TabsContent value="parsed">
                  <ParsedTab lightboxData={lightboxData} />
                </TabsContent>

                <TabsContent value="raw">
                  <RawTab lightboxData={lightboxData} />
                </TabsContent>

                <TabsContent value="documents">
                  <DocumentUpload />
                </TabsContent>

                <div className="sticky bottom-8 flex justify-end mt-8">
                  <Button
                    onClick={() => navigate('/assessment')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20"
                    size="lg"
                  >
                    Proceed to Assessment Data
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-gray-700 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="flex flex-col h-[400px] py-4">
                <ScrollArea className="flex-1 mb-4 px-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.agent === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.agent === 'user'
                              ? 'bg-primary/10 text-primary-foreground'
                              : 'bg-gray-800 text-gray-100'
                          }`}
                        >
                          <div className="text-sm font-medium mb-1">
                            {msg.agent === 'user' ? 'You' : msg.agent}
                          </div>
                          <div className="text-sm">{msg.message}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex gap-2 px-4">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[60px] bg-gray-800/50 border-gray-700"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleSubmit()}
                    disabled={isProcessing}
                    className="px-8 h-[60px]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
      <DebugPanel />
    </div>
  );
};

export default AICivilEngineer;
