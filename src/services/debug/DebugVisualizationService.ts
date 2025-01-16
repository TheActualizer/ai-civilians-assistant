import { supabase } from "@/integrations/supabase/client";

export interface VisualizationData {
  id: string;
  type: string;
  data: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

class DebugVisualizationService {
  private static instance: DebugVisualizationService;

  private constructor() {}

  static getInstance(): DebugVisualizationService {
    if (!DebugVisualizationService.instance) {
      DebugVisualizationService.instance = new DebugVisualizationService();
    }
    return DebugVisualizationService.instance;
  }

  async createVisualization(data: Omit<VisualizationData, 'id'>): Promise<VisualizationData> {
    const { data: newViz, error } = await supabase
      .from('debug_visualizations')
      .insert({
        panel_type: data.type,
        visualization_data: data.data as Record<string, unknown>,
        settings: data.settings || {}
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: newViz.id,
      type: newViz.panel_type,
      data: newViz.visualization_data as Record<string, unknown>,
      settings: newViz.settings as Record<string, unknown>
    };
  }

  async getVisualization(id: string): Promise<VisualizationData | null> {
    const { data, error } = await supabase
      .from('debug_visualizations')
      .select()
      .eq('id', id)
      .single();

    if (error) return null;

    return {
      id: data.id,
      type: data.panel_type,
      data: data.visualization_data as Record<string, unknown>,
      settings: data.settings as Record<string, unknown>
    };
  }
}

export const debugVisualizationService = DebugVisualizationService.getInstance();