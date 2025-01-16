import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, Server, Database, Network, 
  Cloud, CheckCircle2, AlertTriangle, XCircle 
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
}

export function InfrastructureDashboard() {
  const { toast } = useToast();
  
  const { data: healthData, isLoading } = useQuery({
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
    refetchInterval: 30000
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
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Uptime</span>
                    <span className="text-sm font-medium text-gray-200">
                      {service.uptime_percentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">CPU</span>
                      <span className="text-gray-300">{service.resource_usage.cpu}%</span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${service.resource_usage.cpu}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Memory</span>
                      <span className="text-gray-300">{service.resource_usage.memory}%</span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${service.resource_usage.memory}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}