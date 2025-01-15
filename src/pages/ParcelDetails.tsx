import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useLocation } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LightBoxResponse } from "@/components/GetStarted/types";
import { Building2, MapPin, FileText, Database, Terminal, Info } from "lucide-react";

const ParcelDetails = () => {
  const session = useSession();
  const location = useLocation();
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

  const addToHistory = (event: string, details?: any) => {
    console.log(`API Event: ${event}`, details);
    setApiCallHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      event,
      details
    }]);
  };

  useEffect(() => {
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
                addToHistory("LightBox API call failed", apiError);
                throw apiError;
              }

              console.log('LightBox API response:', data);
              addToHistory("LightBox API call successful", data);
              setLightboxData(data as LightBoxResponse);
              
              toast({
                title: "Success",
                description: "LightBox data fetched successfully"
              });
            } catch (apiError) {
              console.error('Error calling LightBox API:', apiError);
              addToHistory("Error in LightBox API call", apiError);
              setError('Failed to fetch LightBox data');
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch LightBox data"
              });
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        addToHistory("Unexpected error occurred", error);
        setError('An unexpected error occurred');
      }
      
      setIsLoading(false);
    };

    fetchLatestRequest();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar session={session} />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center">
            <p className="text-gray-600">Loading parcel details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar session={session} />
        <div className="container mx-auto pt-24 px-4">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const renderPropertyDetails = () => {
    if (!lightboxData?.propertyDetails) return null;
    
    const details = lightboxData.propertyDetails;
    const detailsArray = Object.entries(details).map(([key, value]) => ({
      key: key.split(/(?=[A-Z])/).join(' ').toLowerCase(),
      value: value || 'Not available'
    }));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {detailsArray.map(({ key, value }) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 capitalize">{key}</h3>
            <p className="mt-1 text-lg">{value}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderAdditionalDetails = () => {
    if (!lightboxData?.rawResponse) return null;
    
    // Extract all fields from the raw response
    const rawData = lightboxData.rawResponse;
    const additionalFields = Object.entries(rawData).filter(([key]) => 
      !['parcelId', 'address', 'propertyDetails'].includes(key)
    );

    return (
      <div className="space-y-6">
        {additionalFields.map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="mt-1 whitespace-pre-wrap">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">LightBox Property Analysis</h1>
            <div className="text-sm text-gray-500">
              Request ID: {requestId}
            </div>
          </div>

          <Tabs defaultValue="property" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="property">Property Details</TabsTrigger>
              <TabsTrigger value="address">Address Info</TabsTrigger>
              <TabsTrigger value="additional">Additional Data</TabsTrigger>
              <TabsTrigger value="api-debug">API Debug</TabsTrigger>
              <TabsTrigger value="parsed">Parsed Data</TabsTrigger>
              <TabsTrigger value="raw">Raw Response</TabsTrigger>
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

            <TabsContent value="api-debug">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <CardTitle>API Integration Debug</CardTitle>
                  </div>
                  <CardDescription>Real-time API integration monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <div className="p-4 space-y-4">
                      {apiCallHistory.map((entry, index) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </Badge>
                            <span className="font-medium">{entry.event}</span>
                          </div>
                          {entry.details && (
                            <pre className="mt-2 text-sm bg-gray-50 p-2 rounded overflow-auto">
                              {JSON.stringify(entry.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;
