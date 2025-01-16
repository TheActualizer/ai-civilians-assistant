import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ApiMetric {
  service_name: string;
  endpoint: string;
  response_time?: number;
  success_rate?: number;
  error_count?: number;
  total_requests?: number;
  performance_data?: Record<string, any>;
  system_metrics?: {
    cpu: number;
    memory: number;
    network: number;
  };
}

class EnterpriseApiService {
  async logMetric(metric: ApiMetric) {
    console.log('Logging enterprise API metric:', metric);
    try {
      const { data, error } = await supabase
        .from('enterprise_api_metrics')
        .insert([metric])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error logging API metric:', error);
      toast({
        variant: "destructive",
        title: "API Monitoring Error",
        description: "Failed to log API metric"
      });
      throw error;
    }
  }

  async getMetrics(serviceName?: string) {
    console.log('Fetching enterprise API metrics for service:', serviceName);
    try {
      let query = supabase
        .from('enterprise_api_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (serviceName) {
        query = query.eq('service_name', serviceName);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching API metrics:', error);
      toast({
        variant: "destructive",
        title: "API Monitoring Error",
        description: "Failed to fetch API metrics"
      });
      throw error;
    }
  }

  async getServiceHealth(serviceName: string) {
    console.log('Checking service health:', serviceName);
    try {
      const { data, error } = await supabase
        .from('enterprise_api_metrics')
        .select('*')
        .eq('service_name', serviceName)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      
      // Calculate health status based on metrics
      const isHealthy = data.success_rate >= 99 && 
                       data.error_count <= 5 &&
                       data.response_time <= 1000;

      return {
        status: isHealthy ? 'healthy' : 'degraded',
        metrics: data,
        lastChecked: data.created_at
      };
    } catch (error: any) {
      console.error('Error checking service health:', error);
      toast({
        variant: "destructive",
        title: "Health Check Error",
        description: `Failed to check ${serviceName} health status`
      });
      throw error;
    }
  }
}

export const enterpriseApiService = new EnterpriseApiService();