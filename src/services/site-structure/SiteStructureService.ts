import { supabase } from "@/integrations/supabase/client";
import { SiteStructurePage } from "@/types/site-structure";

export class SiteStructureService {
  static async getPageStructure(path: string): Promise<SiteStructurePage | null> {
    const { data, error } = await supabase
      .from('site_structure')
      .select('*')
      .eq('page_path', path)
      .single();

    if (error) {
      console.error('Error fetching page structure:', error);
      return null;
    }

    if (!data) return null;

    // Transform the data to match SiteStructurePage interface
    return {
      id: data.id,
      path: data.page_path,
      title: data.title,
      sections: data.component_data?.sections || [],
      features: data.component_data?.features || [],
      integrations: data.component_data?.integrations || [],
      metadata: data.metadata || {}
    };
  }

  static async getAllPages(): Promise<SiteStructurePage[]> {
    const { data, error } = await supabase
      .from('site_structure')
      .select('*');

    if (error) {
      console.error('Error fetching all pages:', error);
      return [];
    }

    // Transform the data to match SiteStructurePage[] interface
    return data.map(page => ({
      id: page.id,
      path: page.page_path,
      title: page.title,
      sections: page.component_data?.sections || [],
      features: page.component_data?.features || [],
      integrations: page.component_data?.integrations || [],
      metadata: page.metadata || {}
    }));
  }

  static async updatePageStructure(page: SiteStructurePage): Promise<boolean> {
    const { error } = await supabase
      .from('site_structure')
      .update({
        title: page.title,
        component_data: {
          sections: page.sections,
          features: page.features,
          integrations: page.integrations
        },
        metadata: page.metadata
      })
      .eq('page_path', page.path);

    if (error) {
      console.error('Error updating page structure:', error);
      return false;
    }

    return true;
  }
}