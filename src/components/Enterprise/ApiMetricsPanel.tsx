import { useEffect, useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import type { ApiMetric } from '@/types/agent';

export function ApiMetricsPanel() {
  const [metrics, setMetrics] = useState<ApiMetric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('enterprise_api_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching API metrics:', error);
        return;
      }

      setMetrics(data.map(metric => ({
        ...metric,
        performance_data: typeof metric.performance_data === 'string' 
          ? JSON.parse(metric.performance_data)
          : metric.performance_data,
        system_metrics: typeof metric.system_metrics === 'string'
          ? JSON.parse(metric.system_metrics)
          : metric.system_metrics
      })));
    };

    fetchMetrics();
    
    const channel = supabase
      .channel('api-metrics')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enterprise_api_metrics' },
        (payload) => {
          console.log('API metrics update:', payload);
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusVariant = (successRate: number) => {
    if (successRate >= 99) return "default";
    if (successRate >= 95) return "secondary";
    if (successRate >= 90) return "outline";
    return "destructive";
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-gray-100">API Performance</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">{metric.service_name}</h4>
                    <p className="text-xs text-gray-400">{metric.endpoint}</p>
                  </div>
                  <Badge variant={getStatusVariant(metric.success_rate)}>
                    {metric.success_rate.toFixed(1)}% Success
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Response Time</span>
                      <span>{metric.response_time.toFixed(2)}ms</span>
                    </div>
                    <Progress value={Math.min((metric.response_time / 1000) * 100, 100)} className="h-1" />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Total Requests: {metric.total_requests}</span>
                    <span>Errors: {metric.error_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}