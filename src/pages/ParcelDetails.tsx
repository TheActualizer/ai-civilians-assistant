import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LightBoxResponse } from "@/components/GetStarted/types";
import { Building2, MapPin, FileText, Database, Terminal, Info, ArrowRight } from "lucide-react";

const ParcelDetails = () => {
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
        .single();

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

      if (propertyRequest) {
        console.log('Latest request found:', propertyRequest);
        addToHistory("Latest property request found", {
          id: propertyRequest.id,
          address: `${propertyRequest.street_address}, ${propertyRequest.city}, ${propertyRequest.state} ${propertyRequest.zip_code}`
        });
        
        setRequestId(propertyRequest.id);
        
        if (propertyRequest.lightbox_data) {
          console.log('Using existing LightBox data:', propertyRequest.lightbox_data);
          addToHistory("Using cached LightBox data", propertyRequest.lightbox_data);
          setLightboxData(propertyRequest.lightbox_data as LightBoxResponse);
        } else {
          try {
            const address = propertyRequest.street_address;
            const city = propertyRequest.city;
            const state = propertyRequest.state;
            const zip = propertyRequest.zip_code;

            console.log('Calling LightBox API with address:', { address, city, state, zip });
            addToHistory("Initiating LightBox API call", {
              address,
              city,
              state,
              zip
            });
            
            const { data, error: apiError } = await supabase.functions.invoke('lightbox-parcel', {
              body: {
                address,
                city,
                state,
                zip
              }
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
              setLightboxData(data as LightBoxResponse);
              
              toast({
                title: "Success",
                description: "LightBox data fetched successfully"
              });
            }
          } catch (apiError) {
            console.error('Error calling LightBox API:', apiError);
            setApiError({
              message: apiError.message || 'Error calling LightBox API',
              details: apiError,
              timestamp: new Date().toISOString()
            });
            addToHistory("Error in LightBox API call", apiError);
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      addToHistory("Unexpected error occurred", error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRequest();
  }, [toast]);

  const renderPropertyDetails = () => {
    if (!lightboxData) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No property details available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lightboxData.propertyDetails && Object.entries(lightboxData.propertyDetails).map(([key, value]) => (
            <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="mt-1 text-lg">{value || 'Not available'}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAdditionalDetails = () => {
    if (!lightboxData) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No additional details available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Processing Status</h3>
            <Badge className="mt-2" variant={lightboxData.lightbox_processed ? "default" : "secondary"}>
              {lightboxData.lightbox_processed ? "Processed" : "Pending"}
            </Badge>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Processing Time</h3>
            <p className="mt-1">
              {lightboxData.processed_at 
                ? new Date(lightboxData.processed_at).toLocaleString()
                : 'Not processed yet'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="flex">
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
        
        <div className="flex-1 pt-24 px-4 pb-8">
          <Tabs defaultValue="property" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="property">
                <Building2 className="h-4 w-4 mr-2" />
                Property
              </TabsTrigger>
              <TabsTrigger value="address">
                <MapPin className="h-4 w-4 mr-2" />
                Address
              </TabsTrigger>
              <TabsTrigger value="additional">
                <Info className="h-4 w-4 mr-2" />
                Additional
              </TabsTrigger>
              <TabsTrigger value="parsed">
                <FileText className="h-4 w-4 mr-2" />
                Parsed
              </TabsTrigger>
              <TabsTrigger value="raw">
                <Database className="h-4 w-4 mr-2" />
                Raw
              </TabsTrigger>
            </TabsList>

            <TabsContent value="property">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle>Property Analysis</CardTitle>
                  </div>
                  <CardDescription>Comprehensive property details from LightBox</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderPropertyDetails()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle>Address Details</CardTitle>
                  </div>
                  <CardDescription>Verified address information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Street Address</h3>
                        <p className="mt-1 text-lg">{lightboxData?.address?.streetAddress || 'Not available'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">City</h3>
                        <p className="mt-1 text-lg">{lightboxData?.address?.city || 'Not available'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">State</h3>
                        <p className="mt-1 text-lg">{lightboxData?.address?.state || 'Not available'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">ZIP Code</h3>
                        <p className="mt-1 text-lg">{lightboxData?.address?.zip || 'Not available'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    <CardTitle>Additional Property Information</CardTitle>
                  </div>
                  <CardDescription>Extended property details from LightBox API</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderAdditionalDetails()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parsed">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Parsed LightBox Data</CardTitle>
                  </div>
                  <CardDescription>Structured data from LightBox API</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Property Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="text-sm font-medium text-gray-500">Parcel ID</h4>
                          <p className="mt-1">{lightboxData?.parcelId || 'Not available'}</p>
                        </div>
                        {lightboxData?.propertyDetails && Object.entries(lightboxData.propertyDetails).map(([key, value]) => (
                          <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="text-sm font-medium text-gray-500 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="mt-1">{value || 'Not available'}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Processing Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="text-sm font-medium text-gray-500">Processing Status</h4>
                          <Badge className="mt-2" variant={lightboxData?.lightbox_processed ? "default" : "secondary"}>
                            {lightboxData?.lightbox_processed ? "Processed" : "Pending"}
                          </Badge>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="text-sm font-medium text-gray-500">Processing Time</h4>
                          <p className="mt-1">
                            {lightboxData?.processed_at 
                              ? new Date(lightboxData.processed_at).toLocaleString()
                              : 'Not processed yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle>Raw API Response</CardTitle>
                  </div>
                  <CardDescription>Complete unmodified response from LightBox API</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <pre className="p-4 text-sm">
                      {JSON.stringify(lightboxData?.rawResponse || {}, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="sticky bottom-8 flex justify-end mt-8 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <Button
                onClick={() => navigate('/assessment')}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white gap-2"
                size="lg"
              >
                Proceed to Assessment Data
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;