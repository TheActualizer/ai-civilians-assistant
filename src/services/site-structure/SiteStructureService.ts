import { supabase } from "@/integrations/supabase/client";
import type { SiteStructurePage } from "@/types/agent";

class SiteStructureService {
  private static instance: SiteStructureService;
  private pages: Map<string, SiteStructurePage> = new Map();

  private constructor() {}

  static getInstance(): SiteStructureService {
    if (!SiteStructureService.instance) {
      SiteStructureService.instance = new SiteStructureService();
    }
    return SiteStructureService.instance;
  }

  async initialize() {
    try {
      const { data: pagesData, error } = await supabase
        .from('site_structure')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      pagesData?.forEach(page => {
        const structuredPage: SiteStructurePage = {
          ...page,
          component_data: {
            sections: page.component_data?.sections || [],
            features: page.component_data?.features || [],
            integrations: page.component_data?.integrations || []
          }
        };
        this.pages.set(page.page_path, structuredPage);
      });

      console.log('Initialized site structure:', this.pages);
    } catch (error) {
      console.error('Error initializing site structure:', error);
    }
  }

  async getPagesByHub(hubName: string): Promise<SiteStructurePage[]> {
    try {
      const { data: pagesData, error } = await supabase
        .from('site_structure')
        .select('*')
        .eq('hub_name', hubName)
        .eq('is_active', true);

      if (error) throw error;

      return pagesData.map(page => ({
        ...page,
        component_data: {
          sections: page.component_data?.sections || [],
          features: page.component_data?.features || [],
          integrations: page.component_data?.integrations || []
        }
      }));
    } catch (error) {
      console.error('Error fetching pages by hub:', error);
      return [];
    }
  }

  getPage(path: string): SiteStructurePage | undefined {
    return this.pages.get(path);
  }

  getAllPages(): SiteStructurePage[] {
    return Array.from(this.pages.values());
  }
}

export const siteStructureService = SiteStructureService.getInstance();