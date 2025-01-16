import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LightBoxResponse } from "@/components/GetStarted/types";
import { PropertyTab } from "@/components/ParcelDetails/PropertyTab";
import { AddressTab } from "@/components/ParcelDetails/AddressTab";
import { AdditionalTab } from "@/components/ParcelDetails/AdditionalTab";
import { ParsedTab } from "@/components/ParcelDetails/ParsedTab";
import { RawTab } from "@/components/ParcelDetails/RawTab";
import { DocumentUpload } from "@/components/ParcelDetails/DocumentUpload";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentsPanel } from "@/components/Agents/AgentsPanel";

const AICivilEngineer = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleAgentMessage = async (message: string, agent: string) => {
    console.log(`Agent ${agent} received message:`, message);
    
    // Add message to history
    setAgentMessages(prev => [...prev, {
      agent,
      message,
      timestamp: new Date().toISOString()
    }]);

    // Show toast notification
    toast({
      title: `Message from ${agent}`,
      description: message,
    });

    // Log the interaction
    addToHistory(`Agent interaction: ${agent}`, { message });
  };

  const handleVoiceInput = async (transcript: string) => {
    console.log('Voice input received:', transcript);
    addToHistory('Voice input received', { transcript });
    
    // Process voice input
    await handleAgentMessage(transcript, 'Civil Engineer');
  };

  const addToHistory = (event: string, details?: any) => {
    console.log(`API Event: ${event}`, details);
    setApiCallHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      event,
      details
    }]);
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    addToHistory("Retrying API call");
    await fetchLatestRequest();
  };

  const handleMessageSubmit = (message: string) => {
    if (message.trim()) {
      addToHistory("User message", { message });
      toast({
        title: "Message sent",
        description: "Your message has been logged for debugging purposes",
      });
    }
  };

  const fetchLatestRequest = async () => {
    addToHistory("Starting to fetch latest property request");
    console.log("Fetching latest property request...");
    
    try {
      const { data: propertyRequest, error: fetchError } = await supabase
        .from('property_requests')
        .select('*, lightbox_data, status_details')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching request:', fetchError);
        addToHistory("Error fetching property request", fetchError);
        setError('Failed to fetch property request');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch property request data"
        });
        return;
      }

      if (!propertyRequest) {
        console.log('No property requests found');
        addToHistory("No property requests found");
        setError('No property requests found');
        toast({
          variant: "destructive",
          title: "No Data",
          description: "No property requests found. Please create a new request."
        });
        return;
      }

      console.log('Latest request found:', propertyRequest);
      addToHistory("Latest property request found", {
        id: propertyRequest.id,
        address: `${propertyRequest.street_address}, ${propertyRequest.city}, ${propertyRequest.state} ${propertyRequest.zip_code}`
      });
      
      setRequestId(propertyRequest.id);
      
      // Increment view count
      const { error: updateError } = await supabase
        .from('property_requests')
        .update({ view_count: (propertyRequest.view_count || 0) + 1 })
        .eq('id', propertyRequest.id);

      if (updateError) {
        console.error('Error updating view count:', updateError);
        addToHistory("Error updating view count", updateError);
      }
      
      if (propertyRequest.lightbox_data) {
        console.log('Using existing LightBox data:', propertyRequest.lightbox_data);
        addToHistory("Using cached LightBox data", propertyRequest.lightbox_data);
        
        const typedLightboxData = propertyRequest.lightbox_data as unknown as LightBoxResponse;
        setLightboxData(typedLightboxData);
      } else {
        try {
          const address = propertyRequest.street_address;
          const city = propertyRequest.city;
          const state = propertyRequest.state;
          const zip = propertyRequest.zip_code;

          console.log('Calling LightBox API with address:', { address, city, state, zip });
          addToHistory("Initiating LightBox API call", { address, city, state, zip });
          
          const { data, error: apiError } = await supabase.functions.invoke('lightbox-parcel', {
            body: { address, city, state, zip }
          });

          if (apiError) {
            console.error('LightBox API call error:', apiError);
            setApiError({
              message: apiError.message || 'Error calling LightBox API',
              details: apiError,
              timestamp: new Date().toISOString()
            });
            addToHistory("LightBox API call failed", apiError);
          } else {
            console.log('LightBox API response:', data);
            addToHistory("LightBox API call successful", data);
            
            const typedData = data as unknown as LightBoxResponse;
            setLightboxData(typedData);
            
            toast({
              title: "Success",
              description: "LightBox data fetched successfully"
            });
          }
        } catch (apiError: any) {
          console.error('Error calling LightBox API:', apiError);
          setApiError({
            message: apiError.message || 'Error calling LightBox API',
            details: apiError,
            timestamp: new Date().toISOString()
          });
          addToHistory("Error in LightBox API call", apiError);
        }
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      addToHistory("Unexpected error occurred", error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRequest();
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
        <div className="flex w-full min-h-[calc(100vh-4rem)]">
          <DebugPanel
            isLoading={isLoading}
            error={error}
            requestId={requestId}
            lightboxData={lightboxData}
            apiCallHistory={apiCallHistory}
            apiError={apiError}
            onRetry={handleRetry}
            onMessageSubmit={handleMessageSubmit}
          />
          
          <div className="flex-1 pt-16 px-6 pb-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <AgentsPanel 
                  onMessage={handleAgentMessage}
                  onVoiceInput={handleVoiceInput}
                  messages={agentMessages}
                />
                <Button
                  onClick={() => navigate('/agent-monitoring')}
                  className="ml-4 gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
                >
                  <span>Advanced Monitoring</span>
                  <ArrowRight className="h-5 w-5 animate-pulse" />
                </Button>
              </div>
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
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AICivilEngineer;
