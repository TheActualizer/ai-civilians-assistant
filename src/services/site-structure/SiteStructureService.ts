import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SiteStructurePage {
  id: string;
  page_path: string;
  title: string;
  parent_path: string | null;
  hub_name: string | null;
  description: string | null;
  is_active: boolean;
  requires_auth: boolean;
  page_type: string;
  metadata: Record<string, any>;
  component_data: {
    sections: any[];
    features: any[];
    integrations: any[];
  };
}

export class SiteStructureService {
  static async getPages() {
    try {
      console.log("🔄 Fetching site structure pages...");
      const { data, error } = await supabase
        .from('site_structure')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error("❌ Error fetching pages:", error);
        toast({
          variant: "destructive",
          title: "Error fetching pages",
          description: "There was a problem loading the site structure",
        });
        throw error;
      }

      console.log("✅ Successfully fetched pages:", data);
      return data as SiteStructurePage[];
    } catch (error) {
      console.error("❌ Error in getPages:", error);
      return [];
    }
  }

  static async getHubPages(hubName: string) {
    try {
      console.log(`🔄 Fetching pages for hub: ${hubName}`);
      const { data, error } = await supabase
        .from('site_structure')
        .select('*')
        .eq('hub_name', hubName)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("❌ Error fetching hub pages:", error);
        throw error;
      }

      console.log(`✅ Successfully fetched pages for hub ${hubName}:`, data);
      return data as SiteStructurePage[];
    } catch (error) {
      console.error("❌ Error in getHubPages:", error);
      return [];
    }
  }
}