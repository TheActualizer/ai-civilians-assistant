import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, Code, FileCode, GitBranch, Package, Puzzle, Link, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface PageVersion {
  version_id: string;
  version_name: string;
  route: string;
  components: any[];
  implementation_details: any;
  layout_type: string;
  page_category: string;
  integration_points?: string[];
  component_registry?: Record<string, any>;
}

export function PageSelector() {
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing page selector...');
    const fetchVersions = async () => {
      try {
        const { data: siteStructure, error: siteError } = await supabase
          .from('site_structure')
          .select('*')
          .eq('is_active', true);

        if (siteError) throw siteError;

        // Transform site structure data into PageVersion format
        const transformedData: PageVersion[] = siteStructure.map(page => ({
          version_id: page.id,
          version_name: page.title,
          route: page.page_path,
          components: page.component_data?.sections || [],
          implementation_details: page.metadata || {},
          layout_type: page.layout_type || 'standard',
          page_category: page.page_category || 'general',
          integration_points: page.integration_points || [],
          component_registry: page.component_data || {}
        }));

        console.log('Transformed page data:', transformedData);
        setVersions(transformedData);
      } catch (error) {
        console.error('Error fetching versions:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load available pages"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [toast]);

  const handleRebuild = async () => {
    if (selectedVersions.size === 0) return;

    setRebuilding(true);
    try {
      console.log('Initiating rebuild for versions:', Array.from(selectedVersions));
      
      const { data, error } = await supabase.functions.invoke('rebuild-versions', {
        body: {
          version_ids: Array.from(selectedVersions),
          rebuild_type: 'full',
          rebuild_config: {
            optimize: true,
            validate: true
          }
        }
      });

      if (error) throw error;

      console.log('Rebuild operation created:', data);

      toast({
        title: "Rebuild Initiated",
        description: "The selected versions are being rebuilt. You'll be notified when complete."
      });

      // Clear selections after successful rebuild initiation
      setSelectedVersions(new Set());

    } catch (error) {
      console.error('Error initiating rebuild:', error);
      toast({
        variant: "destructive",
        title: "Rebuild Failed",
        description: "Failed to initiate rebuild process. Please try again."
      });
    } finally {
      setRebuilding(false);
    }
  };

  const toggleVersionSelection = (versionId: string) => {
    const newSelected = new Set(selectedVersions);
    if (newSelected.has(versionId)) {
      newSelected.delete(versionId);
    } else {
      newSelected.add(versionId);
    }
    setSelectedVersions(newSelected);
    console.log('Selected versions:', Array.from(newSelected));
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Page Implementation Details</CardTitle>
          </div>
          <Button
            onClick={handleRebuild}
            className="gap-2"
            disabled={selectedVersions.size === 0 || rebuilding}
          >
            {rebuilding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Code className="h-4 w-4" />
            )}
            {rebuilding ? 'Rebuilding...' : 'Rebuild Selected'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <FileCode className="h-12 w-12 mb-4" />
            <p>No pages available for rebuild</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {versions.map((version) => (
                <Accordion type="single" collapsible key={version.version_id}>
                  <AccordionItem value={version.version_id}>
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => toggleVersionSelection(version.version_id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{version.version_name}</h4>
                          {selectedVersions.has(version.version_id) && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{version.route}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {version.layout_type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {version.page_category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <AccordionContent className="px-4 py-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Puzzle className="h-4 w-4" />
                            <span>Components</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.keys(version.component_registry || {}).map((comp) => (
                              <Badge key={comp} variant="secondary" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Link className="h-4 w-4" />
                            <span>Integration Points</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {version.integration_points?.map((point) => (
                              <Badge key={point} variant="outline" className="text-xs">
                                {point}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
