import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, Code, FileCode, GitBranch, Package, Puzzle, Link } from "lucide-react";
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
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing page selector...');
    const fetchVersions = async () => {
      try {
        const { data, error } = await supabase
          .from('code_implementation_mapping')
          .select('*')
          .order('route');

        if (error) throw error;

        console.log('Fetched versions:', data);
        setVersions(data);
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
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Rebuild functionality will be implemented in the next update"
              });
            }}
            className="gap-2"
            disabled={selectedVersions.size === 0}
          >
            <Code className="h-4 w-4" />
            Rebuild Selected
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
                        {/* Components Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Puzzle className="h-4 w-4" />
                            <span>Components</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {version.component_registry && Object.keys(version.component_registry).map((comp) => (
                              <Badge key={comp} variant="secondary" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Integration Points */}
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

                        {/* Dependencies */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Package className="h-4 w-4" />
                            <span>Dependencies</span>
                          </div>
                          {version.implementation_details?.dependencies && (
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(version.implementation_details.dependencies).map(([name, version]) => (
                                <Badge key={name} variant="secondary" className="text-xs">
                                  {name}@{version}
                                </Badge>
                              ))}
                            </div>
                          )}
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