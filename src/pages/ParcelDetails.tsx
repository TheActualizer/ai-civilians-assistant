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
              addToHistory("Initiating LightBox API call", {
                address: propertyRequest.street_address,
                city: propertyRequest.city,
                state: propertyRequest.state,
                zip: propertyRequest.zip_code
              });
              
              console.log('Calling LightBox API...');
              const { data, error: apiError } = await supabase.functions.invoke('lightbox-parcel', {
                body: {
                  address: propertyRequest.street_address,
                  city: propertyRequest.city,
                  state: propertyRequest.state,
                  zip: propertyRequest.zip_code
                }
              });

              if (apiError) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">LightBox API Debug Dashboard</h1>
            <div className="text-sm text-gray-500">
              Request ID: {requestId}
            </div>
          </div>

          <Tabs defaultValue="api-debug" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="api-debug">API Debug</TabsTrigger>
              <TabsTrigger value="parsed">Parsed Data</TabsTrigger>
              <TabsTrigger value="raw">Raw Response</TabsTrigger>
              <TabsTrigger value="timeline">Request Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="api-debug">
              <Card>
                <CardHeader>
                  <CardTitle>API Integration Debug</CardTitle>
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
                  <CardTitle>Parsed LightBox Data</CardTitle>
                  <CardDescription>Structured data from LightBox API</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Address Details</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Street Address</TableCell>
                            <TableCell>{lightboxData?.address?.streetAddress}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">City</TableCell>
                            <TableCell>{lightboxData?.address?.city}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">State</TableCell>
                            <TableCell>{lightboxData?.address?.state}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">ZIP</TableCell>
                            <TableCell>{lightboxData?.address?.zip}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Property Details</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Parcel ID</TableCell>
                            <TableCell>{lightboxData?.parcelId}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Land Use</TableCell>
                            <TableCell>{lightboxData?.propertyDetails?.landUse}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Lot Size</TableCell>
                            <TableCell>{lightboxData?.propertyDetails?.lotSize}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Zoning</TableCell>
                            <TableCell>{lightboxData?.propertyDetails?.zoning}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Year Built</TableCell>
                            <TableCell>{lightboxData?.propertyDetails?.yearBuilt}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Raw API Response</CardTitle>
                  <CardDescription>Complete unmodified response from LightBox API</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <pre className="p-4 text-sm">
                      {JSON.stringify(lightboxData?.rawResponse, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Request Timeline</CardTitle>
                  <CardDescription>Detailed timeline of API requests and responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiCallHistory.map((entry, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="min-w-[150px] text-sm text-gray-500">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                        <div>
                          <p className="font-medium">{entry.event}</p>
                          {entry.details && (
                            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
                              {JSON.stringify(entry.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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