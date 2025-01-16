export interface SiteStructurePage {
  id: string;
  title: string;
  path: string;
  description: string;
  component_data: {
    sections: any[];
    features: any[];
    integrations: any[];
  };
  metadata: Record<string, any>;
}

export interface PageVersion {
  version_id: string;
  version_name: string;
  route: string;
  components: any[];
  implementation_details: Record<string, any>;
  layout_type: string;
  page_category: string;
  integration_points: string[];
  component_registry: Record<string, any>;
}