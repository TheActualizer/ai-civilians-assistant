import { useState, useEffect } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { Check, History, GitBranch, Layers, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { UIVersion } from "@/components/GetStarted/types";

export function VersionSelector() {
  const session = useSession();
  const { toast } = useToast();
  const [versions, setVersions] = useState<UIVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Initializing version selector...');
    const fetchVersions = async () => {
      try {
        const { data, error } = await supabase
          .from('ui_versions')
          .select('*')
          .eq('route', window.location.pathname)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('Fetched versions:', data);
        
        // Transform the data to match UIVersion interface
        const transformedData: UIVersion[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          route: item.route,
          component_data: item.component_data || {},
          version_type: item.version_type || 'page',
          version_tags: item.version_tags || [],
          performance_metrics: {
            api_latency: (item.performance_metrics?.api_latency || []) as number[],
            render_time: (item.performance_metrics?.render_time || []) as number[],
            memory_usage: (item.performance_metrics?.memory_usage || []) as number[],
          },
          integration_data: {
            connected_services: (item.integration_data?.connected_services || []) as string[],
            api_dependencies: (item.integration_data?.api_dependencies || []) as string[],
            data_flow: (item.integration_data?.data_flow || []) as string[],
          },
          created_at: item.created_at,
        }));

        setVersions(transformedData);
      } catch (error) {
        console.error('Error fetching versions:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load UI versions"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('ui-versions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ui_versions',
          filter: `route=eq.${window.location.pathname}`,
        },
        (payload) => {
          console.log('Version update received:', payload);
          if (payload.eventType === 'INSERT') {
            const newVersion = payload.new;
            const transformedVersion: UIVersion = {
              id: newVersion.id,
              name: newVersion.name,
              route: newVersion.route,
              component_data: newVersion.component_data || {},
              version_type: newVersion.version_type || 'page',
              version_tags: newVersion.version_tags || [],
              performance_metrics: {
                api_latency: (newVersion.performance_metrics?.api_latency || []) as number[],
                render_time: (newVersion.performance_metrics?.render_time || []) as number[],
                memory_usage: (newVersion.performance_metrics?.memory_usage || []) as number[],
              },
              integration_data: {
                connected_services: (newVersion.integration_data?.connected_services || []) as string[],
                api_dependencies: (newVersion.integration_data?.api_dependencies || []) as string[],
                data_flow: (newVersion.integration_data?.data_flow || []) as string[],
              },
              created_at: newVersion.created_at,
            };
            setVersions(prev => [transformedVersion, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const synthesizeVersions = async () => {
    if (selectedVersions.size < 2) {
      toast({
        title: "Selection Required",
        description: "Please select at least two versions to synthesize",
      });
      return;
    }

    try {
      const selectedVersionData = versions.filter(v => selectedVersions.has(v.id));
      console.log('Synthesizing versions:', selectedVersionData);

      // Create a new synthesized version
      const { data: newVersion, error } = await supabase
        .from('ui_versions')
        .insert({
          name: `Synthesized Version ${new Date().toLocaleString()}`,
          route: window.location.pathname,
          component_data: selectedVersionData.reduce((acc, v) => ({ ...acc, ...v.component_data }), {}),
          version_type: 'synthesized',
          version_tags: Array.from(new Set(selectedVersionData.flatMap(v => v.version_tags))),
          created_by: session?.user?.id,
          integration_data: {
            connected_services: Array.from(new Set(selectedVersionData.flatMap(v => v.integration_data.connected_services))),
            api_dependencies: Array.from(new Set(selectedVersionData.flatMap(v => v.integration_data.api_dependencies))),
            data_flow: Array.from(new Set(selectedVersionData.flatMap(v => v.integration_data.data_flow)))
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Versions synthesized successfully",
      });

      console.log('New synthesized version created:', newVersion);
    } catch (error) {
      console.error('Error synthesizing versions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to synthesize versions"
      });
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Version Management</CardTitle>
          </div>
          <Button
            onClick={synthesizeVersions}
            className="gap-2"
            disabled={selectedVersions.size < 2}
          >
            <Layers className="h-4 w-4" />
            Synthesize Selected
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
            <History className="h-12 w-12 mb-4" />
            <p>No saved versions yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() => toggleVersionSelection(version.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{version.name}</h4>
                      {selectedVersions.has(version.id) && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {version.version_tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {new Date(version.created_at).toLocaleDateString()}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}