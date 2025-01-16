import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { ChatInterface } from "@/components/Chat/ChatInterface";
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

  const handleAgentMessage = async (message: string, agent: string) => {
    console.log(`Agent ${agent} received message:`, message);
    
    const newMessage = {
      agent,
      message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);

    try {
      const { error } = await supabase
        .from('chat_history')
        .insert([{
          message: message,
          response: null,
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

  const handleMessageSubmit = async (message: string) => {
    if (!message.trim()) return;
    
    setIsProcessing(true);
    const userMessage = {
      agent: 'user',
      message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Store in chat history
      const { error } = await supabase
        .from('chat_history')
        .insert([{
          message,
          response: null,
          context: { type: 'user_message' }
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing chat message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to store message"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    console.log('Voice input received:', transcript);
    await handleMessageSubmit(transcript);
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
        {/* Debug Panels Container */}
        <div className="fixed top-16 right-0 z-50 w-[800px] h-screen bg-transparent pointer-events-none">
          <div className="w-full h-full pointer-events-auto">
            <DebugPanel />
          </div>
        </div>

        <div className="flex flex-col w-full min-h-[calc(100vh-4rem)]">
          <div className="flex-1 pt-16 px-6 pb-[500px]">
            <div className="mb-8">
              <AgentsPanel 
                onMessage={handleAgentMessage}
                onVoiceInput={handleVoiceInput}
                messages={messages}
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
              </div>
            </Tabs>
          </div>

          <ChatInterface
            messages={messages}
            onMessageSubmit={handleMessageSubmit}
            onVoiceInput={handleVoiceInput}
          />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AICivilEngineer;