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

  async initialize(config: { type: string; mode: string; theme: string; animations: boolean }) {
    try {
      const { data: newViz, error } = await supabase
        .from('debug_visualizations')
        .insert([{
          panel_type: config.type,
          visualization_data: {},
          settings: config
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: newViz.id,
        type: newViz.panel_type,
        data: newViz.visualization_data as Record<string, unknown>,
        settings: newViz.settings as Record<string, unknown>
      };
    } catch (error) {
      console.error('Error initializing visualization:', error);
      throw error;
    }
  }

  async getVisualization(id: string): Promise<VisualizationData> {
    const { data, error } = await supabase
      .from('debug_visualizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      type: data.panel_type,
      data: data.visualization_data as Record<string, unknown>,
      settings: data.settings as Record<string, unknown>
    };
  }
}

export const debugVisualizationService = DebugVisualizationService.getInstance();