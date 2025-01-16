import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Versions, History, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UIVersion {
  id: string;
  name: string;
  description: string | null;
  route: string;
  is_active: boolean;
  created_at: string;
  component_data: Record<string, any>;
  metadata: Record<string, any>;
}

export function VersionSwitcher() {
  const session = useSession();
  const { toast } = useToast();
  const [versions, setVersions] = useState<UIVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Initializing version switcher...');
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
        setVersions(data || []);
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
          table: 'ui_versions'
        },
        (payload) => {
          console.log('UI version update:', payload);
          if (payload.eventType === 'INSERT') {
            setVersions(prev => [payload.new as UIVersion, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const saveCurrentVersion = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please login to save versions",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ui_versions')
        .insert({
          name: `Version ${new Date().toLocaleString()}`,
          route: window.location.pathname,
          component_data: {}, // You can store current component state here
          created_by: session.user.id
        });

      if (error) throw error;

      toast({
        title: "Version Saved",
        description: "Current UI state has been preserved",
      });
    } catch (error) {
      console.error('Error saving version:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save version"
      });
    }
  };

  return (
    <Card className="w-full bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Versions className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm text-gray-200">UI Versions</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={saveCurrentVersion}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            Save Current
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
            <AlertCircle className="h-12 w-12 mb-4" />
            <p>No saved versions yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                >
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">{version.name}</h4>
                    {version.description && (
                      <p className="text-xs text-gray-400">{version.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {new Date(version.created_at).toLocaleDateString()}
                    </Badge>
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