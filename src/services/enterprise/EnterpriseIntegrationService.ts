import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ApiMetric } from "@/types/agent";

class EnterpriseIntegrationService {
  private static instance: EnterpriseIntegrationService;
  private integrations: Map<string, any> = new Map();

  private constructor() {
    console.log('Initializing Enterprise Integration Service...');
  }

  static getInstance(): EnterpriseIntegrationService {
    if (!EnterpriseIntegrationService.instance) {
      EnterpriseIntegrationService.instance = new EnterpriseIntegrationService();
    }
    return EnterpriseIntegrationService.instance;
  }

  async registerIntegration(name: string, config: any) {
    console.log(`Registering integration: ${name}`, config);
    try {
      const { data, error } = await supabase
        .from('enterprise_api_metrics')
        .insert({
          service_name: name,
          endpoint: 'registration',
          performance_data: config,
          system_metrics: {
            cpu: 0,
            memory: 0,
            network: 0
          }
        })
        .select()
        .single();

      if (error) throw error;
      
      this.integrations.set(name, {
        ...config,
        id: data.id,
        status: 'active'
      });

      toast({
        title: "Integration Registered",
        description: `Successfully registered ${name} integration`
      });

      return data;
    } catch (error) {
      console.error('Error registering integration:', error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: `Failed to register ${name} integration`
      });
      throw error;
    }
  }

  async getIntegrationMetrics(name?: string): Promise<ApiMetric[]> {
    console.log('Fetching integration metrics for:', name);
    try {
      let query = supabase
        .from('enterprise_api_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (name) {
        query = query.eq('service_name', name);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as ApiMetric[];
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  async updateIntegrationStatus(name: string, status: string) {
    console.log(`Updating integration status: ${name} -> ${status}`);
    try {
      const integration = this.integrations.get(name);
      if (!integration) {
        throw new Error(`Integration ${name} not found`);
      }

      const { error } = await supabase
        .from('enterprise_api_metrics')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', integration.id);

      if (error) throw error;

      this.integrations.set(name, {
        ...integration,
        status
      });

      return true;
    } catch (error) {
      console.error('Error updating integration status:', error);
      throw error;
    }
  }
}

export const enterpriseIntegrationService = EnterpriseIntegrationService.getInstance();