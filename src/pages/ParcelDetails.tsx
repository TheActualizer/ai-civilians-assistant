import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useLocation } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface LightBoxResponse {
  parcelId?: string;
  address?: {
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
  };
  propertyDetails?: {
    landUse?: string;
    lotSize?: string;
    zoning?: string;
    yearBuilt?: string;
  };
  rawResponse?: any;
  timestamp?: string;
}

const ParcelDetails = () => {
  const session = useSession();
  const location = useLocation();
  const [lightboxData, setLightboxData] = useState<LightBoxResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestRequest = async () => {
      console.log("Fetching latest property request...");
      const { data, error } = await supabase
        .from('property_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching request:', error);
        setError('Failed to fetch property request');
        return;
      }

      if (data) {
        console.log('Latest request found:', data);
        setRequestId(data.id);
        // Simulate LightBox API response for now
        // In production, this would make an actual API call
        setLightboxData({
          parcelId: "123456789",
          address: {
            streetAddress: data.street_address,
            city: data.city,
            state: data.state,
            zip: data.zip_code
          },
          propertyDetails: {
            landUse: "Residential",
            lotSize: "0.25 acres",
            zoning: "R-1",
            yearBuilt: "1985"
          },
          timestamp: new Date().toISOString(),
          rawResponse: {
            // Raw API response would go here
            status: "success",
            apiVersion: "1.0",
            requestId: "lb_" + data.id
          }
        });
      }
      setIsLoading(false);
    };

    fetchLatestRequest();
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-900">LightBox Parcel Debugger</h1>
            <div className="text-sm text-gray-500">
              Request ID: {requestId}
            </div>
          </div>

          <Tabs defaultValue="parsed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="parsed">Parsed Data</TabsTrigger>
              <TabsTrigger value="raw">Raw Response</TabsTrigger>
              <TabsTrigger value="timeline">API Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="parsed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Property Information</CardTitle>
                  <CardDescription>Parsed data from LightBox API response</CardDescription>
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
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                    {JSON.stringify(lightboxData?.rawResponse, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>API Request Timeline</CardTitle>
                  <CardDescription>Detailed timeline of the API request and response</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Request Initiated</p>
                        <p className="text-sm text-gray-500">{lightboxData?.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">Response Received</p>
                        <p className="text-sm text-gray-500">{lightboxData?.timestamp}</p>
                      </div>
                    </div>
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