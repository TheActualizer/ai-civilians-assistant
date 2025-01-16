import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2, MapPin, FileText, Building2, FileOutput, Database, Terminal, Code, History, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProcessingStatusProps, PropertyRequest, FunctionLog } from "./types";

export const ProcessingStatus = ({ requestId }: ProcessingStatusProps) => {
  const [request, setRequest] = useState<PropertyRequest | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [functionLogs, setFunctionLogs] = useState<FunctionLog[]>([]);
  const [originalAddress, setOriginalAddress] = useState<{
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
  } | null>(null);
  const { toast } = useToast();

  // Memoize the fetch function to prevent recreating it on every render
  const fetchRequest = useCallback(async () => {
    console.log('Fetching request data for ID:', requestId);
    const { data, error } = await supabase
      .from('property_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error) {
      console.error('Error fetching request:', error);
      setLogs(prev => [...prev, `Error fetching request: ${error.message}`]);
      toast({
        title: "Error Fetching Request",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const typedData = data as unknown as PropertyRequest;
    
    // Only log initial data once
    if (!request) {
      console.log('Initial request data:', typedData);
      setLogs(prev => [...prev, `Request ${requestId} loaded successfully`]);
    }
    
    if (!request && !originalAddress) {
      setOriginalAddress({
        street_address: typedData.street_address,
        city: typedData.city,
        state: typedData.state,
        zip_code: typedData.zip_code
      });
      
      toast({
        title: "Processing Started",
        description: `Now processing property at ${typedData.street_address}`,
      });
    }
    
    setRequest(typedData);
    
    if (typedData.processing_steps) {
      const steps = Object.values(typedData.processing_steps).filter(step => typeof step === 'boolean');
      const completedSteps = steps.filter(step => step === true).length;
      setProgress((completedSteps / (steps.length - 1)) * 100);
    }
  }, [requestId, request, originalAddress, toast]);

  useEffect(() => {
    if (!requestId) return;

    // Initial fetch
    fetchRequest();

    // Set up real-time subscription
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
          
          if (payload.new) {
            const typedPayload = payload.new as unknown as PropertyRequest;
            const oldRequest = request;
            setRequest(typedPayload);

            if (originalAddress) {
              const addressChanges: string[] = [];
              
              if (originalAddress.street_address !== typedPayload.street_address) {
                addressChanges.push(`Street Address: "${originalAddress.street_address}" → "${typedPayload.street_address}"`);
              }
              if (originalAddress.city !== typedPayload.city) {
                addressChanges.push(`City: "${originalAddress.city}" → "${typedPayload.city}"`);
              }
              if (originalAddress.state !== typedPayload.state) {
                addressChanges.push(`State: "${originalAddress.state}" → "${typedPayload.state}"`);
              }
              if (originalAddress.zip_code !== typedPayload.zip_code) {
                addressChanges.push(`ZIP Code: "${originalAddress.zip_code}" → "${typedPayload.zip_code}"`);
              }

              if (addressChanges.length > 0) {
                toast({
                  title: "Address Standardized",
                  description: "The following address components were standardized:\n" + addressChanges.join('\n'),
                  duration: 10000,
                });
                console.log('Address changes detected:', addressChanges);
                
                // Only add function logs for actual changes
                setFunctionLogs(prev => [...prev, {
                  timestamp: new Date().toISOString(),
                  function: 'address-standardization',
                  status: 'success',
                  message: `Address components standardized`
                }]);
              }
            }

            const steps = Object.values(typedPayload.processing_steps || {}).filter(step => typeof step === 'boolean');
            const completedSteps = steps.filter(step => step === true).length;
            const newProgress = (completedSteps / (steps.length - 1)) * 100;
            setProgress(newProgress);

            // Only log progress changes
            if (newProgress !== progress) {
              setFunctionLogs(prev => [...prev, {
                timestamp: new Date().toISOString(),
                function: 'realtime-update',
                status: 'info',
                message: `Processing progress: ${Math.round(newProgress)}%`
              }]);
            }

            if (typedPayload.processing_steps.completed && !oldRequest?.processing_steps.completed) {
              toast({
                title: "Processing Complete",
                description: "Your property analysis has been completed!",
                variant: "default",
              });
              console.log('Processing completed');
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [requestId, request, toast, originalAddress, progress, fetchRequest]);

  const getStepIcon = (stepCompleted: boolean) => {
    if (stepCompleted) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />;
  };

  if (!request) return null;

  // Extract validation details from the request
  const validationDetails = request.status_details.address_validation;
  const displayAddress = {
    street_address: request.street_address,
    city: request.city,
    state: request.state,
    zip_code: request.zip_code
  };

  const isDifferent = (str1: string, str2: string) => 
    str1?.toLowerCase().trim() !== str2?.toLowerCase().trim();

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
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 text-right">{Math.round(progress)}% Complete</p>
            </div>

            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="address">Address Validation</TabsTrigger>
                <TabsTrigger value="functions">Function Execution</TabsTrigger>
                <TabsTrigger value="database">Database State</TabsTrigger>
                <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="address" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <CardTitle>Address Details</CardTitle>
                      </div>
                      {getStepIcon(request.processing_steps.address_validated)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Street Address</h4>
                          <p className="mt-1">{request.street_address}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">City</h4>
                          <p className="mt-1">{request.city}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">State</h4>
                          <p className="mt-1">{request.state}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">ZIP Code</h4>
                          <p className="mt-1">{request.zip_code}</p>
                        </div>
                      </div>
                      
                      {request.coordinates && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Coordinates</h4>
                          <div className="mt-1 flex gap-2">
                            <Badge variant="secondary">
                              Lat: {request.coordinates.lat}
                            </Badge>
                            <Badge variant="secondary">
                              Lng: {request.coordinates.lng}
                            </Badge>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Validation Status</h4>
                        <p className="mt-1">{request.status_details.address_validation || 'Pending validation...'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="functions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      <CardTitle>Function Execution Log</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded border p-4">
                      <div className="space-y-4">
                        {functionLogs.map((log, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="flex-shrink-0">
                              {log.status === 'success' && <Check className="h-4 w-4 text-green-500" />}
                              {log.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                              {log.status === 'info' && <History className="h-4 w-4 text-blue-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-gray-500">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <Badge variant="outline">{log.function}</Badge>
                              </div>
                              <p className="mt-1 text-gray-700">{log.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="database" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <CardTitle>Database State</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Record Timeline</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Created:</span>
                            <span className="font-mono">
                              {new Date(request.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="font-mono">
                              {new Date(request.updated_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Processing Steps State</h4>
                        <div className="mt-2 space-y-2">
                          {Object.entries(request.processing_steps).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {key.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}:
                              </span>
                              <Badge variant={value ? "default" : "secondary"}>
                                {value ? "Completed" : "Pending"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Raw Database Record</h4>
                        <ScrollArea className="mt-2 h-[200px] w-full rounded border p-4">
                          <pre className="text-xs">
                            {JSON.stringify(request, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      <CardTitle>Address Standardization Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">Address Validation Status</h4>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm">
                            {validationDetails || "Validation status not available"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">Address Components Analysis</h4>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h5 className="font-medium text-sm mb-2">Original Input</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Street:</span>
                                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                                  {originalAddress.street_address}
                                </code>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">City:</span>
                                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                                  {originalAddress.city}
                                </code>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">State:</span>
                                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                                  {originalAddress.state}
                                </code>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">ZIP:</span>
                                <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                                  {originalAddress.zip_code}
                                </code>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-2">Google Maps API Output</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Street:</span>
                                <code className={`text-sm px-2 py-0.5 rounded ${
                                  isDifferent(request.street_address, originalAddress.street_address)
                                  ? 'bg-yellow-100' 
                                  : 'bg-gray-100'
                                }`}>
                                  {request.street_address}
                                </code>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">City:</span>
                                <code className={`text-sm px-2 py-0.5 rounded ${
                                  isDifferent(request.city, originalAddress.city)
                                  ? 'bg-yellow-100' 
                                  : 'bg-gray-100'
                                }`}>
                                  {request.city}
                                </code>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">State:</span>
                                <code className={`text-sm px-2 py-0.5 rounded ${
                                  isDifferent(request.state, originalAddress.state)
                                  ? 'bg-yellow-100' 
                                  : 'bg-gray-100'
                                }`}>
                                  {request.state}
                                </code>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">ZIP:</span>
                                <code className={`text-sm px-2 py-0.5 rounded ${
                                  isDifferent(request.zip_code, originalAddress.zip_code)
                                  ? 'bg-yellow-100' 
                                  : 'bg-gray-100'
                                }`}>
                                  {request.zip_code}
                                </code>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Detected Changes</h4>
                          <div className="space-y-2">
                            {isDifferent(request.street_address, originalAddress.street_address) && (
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="bg-yellow-50">Street</Badge>
                                <span className="text-gray-600">Changed from</span>
                                <code className="bg-gray-100 px-2 py-0.5 rounded">{originalAddress.street_address}</code>
                                <span className="text-gray-600">to</span>
                                <code className="bg-yellow-100 px-2 py-0.5 rounded">{request.street_address}</code>
                              </div>
                            )}
                            {isDifferent(request.city, originalAddress.city) && (
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="bg-yellow-50">City</Badge>
                                <span className="text-gray-600">Changed from</span>
                                <code className="bg-gray-100 px-2 py-0.5 rounded">{originalAddress.city}</code>
                                <span className="text-gray-600">to</span>
                                <code className="bg-yellow-100 px-2 py-0.5 rounded">{request.city}</code>
                              </div>
                            )}
                            {isDifferent(request.state, originalAddress.state) && (
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="bg-yellow-50">State</Badge>
                                <span className="text-gray-600">Changed from</span>
                                <code className="bg-gray-100 px-2 py-0.5 rounded">{originalAddress.state}</code>
                                <span className="text-gray-600">to</span>
                                <code className="bg-yellow-100 px-2 py-0.5 rounded">{request.state}</code>
                              </div>
                            )}
                            {isDifferent(request.zip_code, originalAddress.zip_code) && (
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="bg-yellow-50">ZIP</Badge>
                                <span className="text-gray-600">Changed from</span>
                                <code className="bg-gray-100 px-2 py-0.5 rounded">{originalAddress.zip_code}</code>
                                <span className="text-gray-600">to</span>
                                <code className="bg-yellow-100 px-2 py-0.5 rounded">{request.zip_code}</code>
                              </div>
                            )}
                          </div>
                        </div>

                        {request.coordinates && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Geocoding Results</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline">Latitude</Badge>
                                <code className="bg-gray-100 px-2 py-0.5 rounded">
                                  {request.coordinates.lat}
                                </code>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline">Longitude</Badge>
                                <code className="bg-gray-100 px-2 py-0.5 rounded">
                                  {request.coordinates.lng}
                                </code>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
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
          </div>
        </CardContent>
      </Card>

      {/* Add sticky navigation button */}
      <div className="sticky bottom-8 flex justify-end mt-8 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <Button
          onClick={() => navigate('/address-validation')}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white gap-2"
          size="lg"
        >
          Continue to Address Validation
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProcessingStatus;