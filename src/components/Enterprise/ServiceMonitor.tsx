import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Server, Cpu, Network, Database, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface ServiceMetrics {
  id: string;
  service_name: string;
  health_score: number;
  status: string;
  performance_metrics: {
    response_times: number[];
    error_rates: number[];
    throughput: number[];
    resource_usage: {
      cpu: number[];
      memory: number[];
      network: number[];
    };
  };
}

export const ServiceMonitor = () => {
  const { toast } = useToast();
  const [activeServices, setActiveServices] = useState<ServiceMetrics[]>([]);

  const { data: services, isLoading } = useQuery({
    queryKey: ['microservice-metrics'],
    queryFn: async () => {
      console.log('Fetching microservice metrics...');
      const { data, error } = await supabase
        .from('microservice_registry')
        .select('*')
        .order('health_score', { ascending: false });

      if (error) {
        console.error('Error fetching service metrics:', error);
        toast({
          variant: "destructive",
          title: "Error fetching service metrics",
          description: error.message
        });
        throw error;
      }

      return data as ServiceMetrics[];
    },
    refetchInterval: 5000
  });

  useEffect(() => {
    console.log('Setting up real-time service monitoring...');
    const channel = supabase
      .channel('service-metrics')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'microservice_registry'
        },
        (payload) => {
          console.log('Service metrics update:', payload);
          setActiveServices(prev => 
            prev.map(service => 
              service.id === payload.new.id ? { ...service, ...payload.new } : service
            )
          );
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up service monitoring subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'computation':
        return <Cpu className="h-4 w-4" />;
      case 'network':
        return <Network className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Activity className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Service Health</h2>
          <Badge variant={services?.every(s => s.health_score >= 90) ? "success" : "warning"}>
            {services?.every(s => s.health_score >= 90) ? "All Systems Operational" : "Degraded Performance"}
          </Badge>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence>
            {services?.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Card className="p-4 bg-gray-800/50 border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(service.service_name)}
                      <h3 className="font-medium text-gray-200">{service.service_name}</h3>
                    </div>
                    <Badge className={getHealthColor(service.health_score)}>
                      {service.health_score}% Health
                    </Badge>
                  </div>

                  <Progress 
                    value={service.health_score} 
                    className="h-1 mb-4"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">CPU Usage</p>
                      <p className="text-sm font-medium text-gray-300">
                        {service.performance_metrics.resource_usage.cpu.slice(-1)[0] || 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Memory</p>
                      <p className="text-sm font-medium text-gray-300">
                        {service.performance_metrics.resource_usage.memory.slice(-1)[0] || 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Network</p>
                      <p className="text-sm font-medium text-gray-300">
                        {service.performance_metrics.resource_usage.network.slice(-1)[0] || 0}%
                      </p>
                    </div>
                  </div>

                  {service.health_score < 90 && (
                    <div className="mt-4 flex items-center gap-2 text-yellow-400 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Performance degradation detected</span>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </Card>
  );
};