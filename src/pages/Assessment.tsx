import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, FileText, Database, Terminal, Info, Building2 } from "lucide-react";

interface AssessmentData {
  assessmentYear: number;
  totalValue: number;
  landValue: number;
  improvementValue: number;
  taxRate: number;
  assessmentDate: string;
  propertyClass: string;
  taxStatus: string;
  lastSalePrice: number;
  lastSaleDate: string;
}

interface PropertyRequest {
  id: string;
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  api_data: {
    assessment?: AssessmentData;
  };
  api_progress: {
    assessment_completed?: boolean;
  };
}

const Assessment = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [propertyRequest, setPropertyRequest] = useState<PropertyRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiCallHistory, setApiCallHistory] = useState<Array<{
    timestamp: string;
    event: string;
    details?: any;
  }>>([]);

  const addToHistory = (event: string, details?: any) => {
    console.log(`Assessment API Event: ${event}`, details);
    setApiCallHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      event,
      details
    }]);
  };

  const fetchAssessmentData = async (propertyId: string) => {
    try {
      addToHistory("Initiating assessment data fetch");
      
      const { data, error } = await supabase.functions.invoke('get-property-assessment', {
        body: { propertyId }
      });

      if (error) {
        console.error('Error fetching assessment:', error);
        addToHistory("Error fetching assessment data", error);
        throw error;
      }

      addToHistory("Assessment data received", data);
      return data;
    } catch (error) {
      console.error('Error in fetchAssessmentData:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchPropertyRequest = async () => {
      try {
        addToHistory("Fetching latest property request");
        
        const { data: request, error: fetchError } = await supabase
          .from('property_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          console.error('Error fetching request:', fetchError);
          addToHistory("Error fetching property request", fetchError);
          setError('Failed to fetch property request');
          return;
        }

        if (request) {
          setPropertyRequest(request);
          addToHistory("Property request found", {
            id: request.id,
            name: request.name,
            address: `${request.street_address}, ${request.city}, ${request.state} ${request.zip_code}`
          });

          if (!request.api_data?.assessment) {
            addToHistory("No assessment data found, fetching from API");
            await fetchAssessmentData(request.id);
            
            // Refresh the property request to get the updated data
            const { data: updatedRequest } = await supabase
              .from('property_requests')
              .select('*')
              .eq('id', request.id)
              .single();
              
            if (updatedRequest) {
              setPropertyRequest(updatedRequest);
              addToHistory("Property request updated with assessment data");
            }
          } else {
            addToHistory("Using cached assessment data", request.api_data.assessment);
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

    fetchPropertyRequest();
  }, []);

  const renderAssessmentDetails = () => {
    if (!propertyRequest?.api_data?.assessment) {
      return (
        <Alert>
          <AlertTitle>No Assessment Data</AlertTitle>
          <AlertDescription>
            Assessment data has not been fetched yet for this property.
          </AlertDescription>
        </Alert>
      );
    }

    const assessment = propertyRequest.api_data.assessment;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Assessment Year</h3>
          <p className="mt-1 text-lg">{assessment.assessmentYear}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
          <p className="mt-1 text-lg">${assessment.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Land Value</h3>
          <p className="mt-1 text-lg">${assessment.landValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Improvement Value</h3>
          <p className="mt-1 text-lg">${assessment.improvementValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Tax Rate</h3>
          <p className="mt-1 text-lg">{(assessment.taxRate * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Assessment Date</h3>
          <p className="mt-1 text-lg">{new Date(assessment.assessmentDate).toLocaleDateString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Property Class</h3>
          <p className="mt-1 text-lg">{assessment.propertyClass}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Tax Status</h3>
          <p className="mt-1 text-lg">{assessment.taxStatus}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Last Sale Price</h3>
          <p className="mt-1 text-lg">${assessment.lastSalePrice.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Last Sale Date</h3>
          <p className="mt-1 text-lg">{new Date(assessment.lastSaleDate).toLocaleDateString()}</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar session={session} />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center">
            <p className="text-gray-600">Loading assessment details...</p>
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
          {/* Compact Header */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{propertyRequest?.name}</h2>
                <p className="text-sm text-gray-500">
                  {propertyRequest?.street_address}, {propertyRequest?.city}, {propertyRequest?.state} {propertyRequest?.zip_code}
                </p>
              </div>
              <Badge variant={propertyRequest?.api_progress?.assessment_completed ? "outline" : "secondary"}>
                {propertyRequest?.api_progress?.assessment_completed ? "Completed" : "Pending"}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="assessment" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assessment">Assessment Data</TabsTrigger>
              <TabsTrigger value="api-debug">API Debug</TabsTrigger>
              <TabsTrigger value="raw">Raw Response</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle>Property Assessment</CardTitle>
                  </div>
                  <CardDescription>Detailed assessment information from API</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderAssessmentDetails()}
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

            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle>Raw API Response</CardTitle>
                  </div>
                  <CardDescription>Complete unmodified response from API</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <pre className="p-4 text-sm">
                      {JSON.stringify(propertyRequest?.api_data?.assessment || {}, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    <CardTitle>API Progress</CardTitle>
                  </div>
                  <CardDescription>Current status of API data collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {propertyRequest?.api_progress && Object.entries(propertyRequest.api_progress).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                        <Badge variant={value ? "outline" : "secondary"}>
                          {value ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="sticky bottom-8 flex justify-end mt-8 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <Button
              onClick={() => navigate('/structures')}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white gap-2"
              size="lg"
            >
              View Structure Details
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;