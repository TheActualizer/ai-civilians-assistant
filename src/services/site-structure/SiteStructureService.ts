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
          id: page.id,
          page_path: page.page_path,
          title: page.title,
          description: page.description || '',
          hub_name: page.hub_name || '',
          parent_path: page.parent_path || '',
          is_active: page.is_active || true,
          requires_auth: page.requires_auth || false,
          page_type: page.page_type || 'content',
          metadata: page.metadata || {},
          component_data: {
            sections: page.component_data?.sections || [],
            features: page.component_data?.features || [],
            integrations: page.component_data?.integrations || []
          },
          created_at: page.created_at,
          updated_at: page.updated_at
        };
        this.pages.set(page.page_path, structuredPage);
      });

      console.log('Initialized site structure:', this.pages);
    } catch (error) {
      console.error('Error initializing site structure:', error);
    }
  }

  async getPages(): Promise<SiteStructurePage[]> {
    try {
      const { data: pagesData, error } = await supabase
        .from('site_structure')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      return pagesData.map(page => ({
        id: page.id,
        page_path: page.page_path,
        title: page.title,
        description: page.description || '',
        hub_name: page.hub_name || '',
        parent_path: page.parent_path || '',
        is_active: page.is_active || true,
        requires_auth: page.requires_auth || false,
        page_type: page.page_type || 'content',
        metadata: page.metadata || {},
        component_data: {
          sections: page.component_data?.sections || [],
          features: page.component_data?.features || [],
          integrations: page.component_data?.integrations || []
        },
        created_at: page.created_at,
        updated_at: page.updated_at
      }));
    } catch (error) {
      console.error('Error fetching pages:', error);
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