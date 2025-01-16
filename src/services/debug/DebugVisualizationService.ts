import { supabase } from "@/integrations/supabase/client";

export interface VisualizationConfig {
  type: 'network' | 'metrics' | 'flow';
  mode: 'artistic' | 'technical';
  theme: 'dark' | 'light';
  animations: boolean;
}

class DebugVisualizationService {
  private config: VisualizationConfig = {
    type: 'network',
    mode: 'technical',
    theme: 'dark',
    animations: true
  };

  async initialize(config?: Partial<VisualizationConfig>) {
    console.log('Initializing Debug Visualization Service...');
    if (config) {
      this.config = { ...this.config, ...config };
    }

    const { data, error } = await supabase
      .from('debug_visualizations')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error loading visualization config:', error);
    } else if (data?.[0]) {
      this.config = { ...this.config, ...data[0].settings };
    }

    return this;
  }

  async saveConfig(config: Partial<VisualizationConfig>) {
    console.log('Saving visualization config:', config);
    const { error } = await supabase
      .from('debug_visualizations')
      .upsert({
        panel_type: 'main',
        settings: config,
        visualization_data: {}
      });

    if (error) {
      console.error('Error saving visualization config:', error);
      throw error;
    }

    this.config = { ...this.config, ...config };
  }

  getConfig(): VisualizationConfig {
    return { ...this.config };
  }
}

export const debugVisualizationService = new DebugVisualizationService();