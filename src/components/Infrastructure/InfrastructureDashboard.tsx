import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, Server, Database, Network, 
  Cloud, CheckCircle2, AlertTriangle, XCircle,
  CpuIcon, MemoryStick, Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface ServiceHealth {
  service_name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime_percentage: number;
  resource_usage: {
    cpu: number;
    memory: number;
    network: number;
  };
  last_check: Date;
  alerts: any[];
  dependencies: string[];
}

export function InfrastructureDashboard() {
  const { toast } = useToast();
  
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: ['service-health'],
    queryFn: async () => {
      console.log('Fetching service health data...');
      const { data, error } = await supabase
        .from('service_health_status')
        .select('*')
        .order('service_name');
        
      if (error) {
        console.error('Error fetching service health:', error);
        toast({
          variant: "destructive",
          title: "Error fetching service health",
          description: error.message
        });
        throw error;
      }
      
      return data as ServiceHealth[];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getServiceIcon = (name: string) => {
    if (name.includes('database')) return <Database className="h-5 w-5" />;
    if (name.includes('network')) return <Network className="h-5 w-5" />;
    if (name.includes('storage')) return <Cloud className="h-5 w-5" />;
    return <Server className="h-5 w-5" />;
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'cpu':
        return <CpuIcon className="h-4 w-4 text-blue-500" />;
      case 'memory':
        return <MemoryStick className="h-4 w-4 text-purple-500" />;
      case 'network':
        return <Globe className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100">Infrastructure Status</h2>
        <Badge variant={healthData?.every(s => s.status === 'healthy') ? 'default' : 'destructive'}>
          {healthData?.every(s => s.status === 'healthy') ? 'All Systems Operational' : 'System Issues Detected'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="h-6 bg-gray-700 rounded animate-pulse w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3"></div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Card className="col-span-full bg-gray-900/50 border-gray-700">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center text-red-500">
                <XCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Error loading service health data</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          healthData?.map((service) => (
            <Card key={service.service_name} className="bg-gray-900/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {getServiceIcon(service.service_name)}
                  {service.service_name}
                </CardTitle>
                {getStatusIcon(service.status)}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Uptime</span>
                    <span className="text-sm font-medium text-gray-200">
                      {service.uptime_percentage.toFixed(2)}%
                    </span>
                  </div>
                  
                  {Object.entries(service.resource_usage).map(([resource, value]) => (
                    <div key={resource} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1 text-gray-400">
                          {getResourceIcon(resource)}
                          {resource.charAt(0).toUpperCase() + resource.slice(1)}
                        </span>
                        <span className="text-gray-300">{value}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            value > 90 ? 'bg-red-500' : 
                            value > 70 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {service.alerts && service.alerts.length > 0 && (
                    <div className="mt-2">
                      <Badge variant="destructive" className="w-full justify-center">
                        {service.alerts.length} Active Alert{service.alerts.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}