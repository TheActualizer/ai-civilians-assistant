import { supabase } from "@/integrations/supabase/client";

export interface MetricData {
  metric_type: string;
  value: number;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  async trackMetric(data: MetricData) {
    console.log('Tracking metric:', data);
    const { error } = await supabase
      .from('debug_analytics')
      .insert([data]);

    if (error) {
      console.error('Error tracking metric:', error);
      throw error;
    }
  }

  async getMetrics(type: string, limit = 100) {
    console.log('Fetching metrics:', { type, limit });
    const { data, error } = await supabase
      .from('debug_analytics')
      .select('*')
      .eq('metric_type', type)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }

    return data;
  }
}

export const analyticsService = new AnalyticsService();