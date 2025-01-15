import { useEffect, useState } from "react";
import { Check, Loader2, MapPin, FileText, Building2, FileOutput, Database, Terminal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

interface ProcessingStatusProps {
  requestId: string;
}

interface ProcessingSteps {
  address_validated: boolean;
  coordinates_mapped: boolean;
  zoning_checked: boolean;
  report_generated: boolean;
  completed: boolean;
}

interface StatusDetails {
  address_validation: string | null;
  geospatial_analysis: string | null;
  zoning_analysis: string | null;
  report_generation: string | null;
}

interface PropertyRequest {
  id: string;
  name: string;
  email: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  description: string | null;
  coordinates: { lat: number | null; lng: number | null } | null;
  processing_steps: ProcessingSteps;
  status_details: StatusDetails;
  created_at: string;
  updated_at: string;
}

export const ProcessingStatus = ({ requestId }: ProcessingStatusProps) => {
  const [request, setRequest] = useState<PropertyRequest | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!requestId) return;

    // Initial fetch
    const fetchRequest = async () => {
      const { data, error } = await supabase
        .from('property_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) {
        console.error('Error fetching request:', error);
        setLogs(prev => [...prev, `Error fetching request: ${error.message}`]);
        return;
      }

      console.log('Initial request data:', data);
      setLogs(prev => [...prev, `Request ${requestId} loaded successfully`]);
      setRequest(data as PropertyRequest);
      
      // Calculate progress
      if (data.processing_steps) {
        const steps = Object.values(data.processing_steps).filter(step => typeof step === 'boolean');
        const completedSteps = steps.filter(step => step === true).length;
        setProgress((completedSteps / (steps.length - 1)) * 100); // -1 to exclude the "completed" flag
      }
    };

    fetchRequest();

    // Subscribe to changes
    const channel = supabase
      .channel(`property_request_${requestId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_requests',
          filter: `id=eq.${requestId}`,
        },
        (payload: any) => {
          console.log('Real-time update received:', payload);
          setLogs(prev => [...prev, `Real-time update received at ${new Date().toISOString()}`]);
          
          if (payload.new) {
            setRequest(payload.new as PropertyRequest);
            
            // Calculate progress
            const steps = Object.values(payload.new.processing_steps || {}).filter(step => typeof step === 'boolean');
            const completedSteps = steps.filter(step => step === true).length;
            setProgress((completedSteps / (steps.length - 1)) * 100);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [requestId]);

  const getStepIcon = (stepCompleted: boolean) => {
    if (stepCompleted) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />;
  };

  if (!request) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-900">Processing Status</CardTitle>
          <CardDescription className="text-gray-600">
            Request ID: {requestId}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 text-right">{Math.round(progress)}% Complete</p>
            </div>

            {/* Request Details */}
            <Accordion type="single" collapsible>
              <AccordionItem value="details">
                <AccordionTrigger className="text-lg font-semibold">
                  Request Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {request.name}</p>
                    <p><span className="font-medium">Email:</span> {request.email}</p>
                    <p><span className="font-medium">Address:</span> {request.street_address}</p>
                    <p><span className="font-medium">Location:</span> {request.city}, {request.state} {request.zip_code}</p>
                    {request.description && (
                      <p><span className="font-medium">Description:</span> {request.description}</p>
                    )}
                    {request.coordinates && (
                      <p><span className="font-medium">Coordinates:</span> {request.coordinates.lat}, {request.coordinates.lng}</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Processing Steps */}
            <div className="space-y-4">
              {/* Address Validation */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Address Validation</h4>
                    {getStepIcon(request.processing_steps.address_validated)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.status_details.address_validation || 'Validating address...'}
                  </p>
                </div>
              </div>

              {/* Geospatial Analysis */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                <div className="bg-green-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Geospatial Analysis</h4>
                    {getStepIcon(request.processing_steps.coordinates_mapped)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.status_details.geospatial_analysis || 'Analyzing location data...'}
                  </p>
                </div>
              </div>

              {/* Zoning Analysis */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Zoning Analysis</h4>
                    {getStepIcon(request.processing_steps.zoning_checked)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.status_details.zoning_analysis || 'Checking zoning regulations...'}
                  </p>
                </div>
              </div>

              {/* Report Generation */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                <div className="bg-orange-100 p-2 rounded-full">
                  <FileOutput className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Report Generation</h4>
                    {getStepIcon(request.processing_steps.report_generated)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.status_details.report_generation || 'Generating final report...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Debug Logs */}
            <Card className="mt-6">
              <CardHeader className="py-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-5 w-5" />
                  <CardTitle className="text-sm font-medium">Debug Logs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] w-full rounded border p-4">
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono">
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Database Status */}
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <CardTitle className="text-sm font-medium">Database Updates</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Created:</span> {new Date(request.created_at).toLocaleString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(request.updated_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};