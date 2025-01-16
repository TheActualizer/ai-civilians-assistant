import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { History, AlertCircle, GitBranch, Sparkles, Rocket, Star, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  const [portalEnergy, setPortalEnergy] = useState(0);

  useEffect(() => {
    console.log('Initializing portal gateway...');
    const fetchVersions = async () => {
      try {
        const { data, error } = await supabase
          .from('ui_versions')
          .select('*')
          .eq('route', window.location.pathname)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('Portal dimensions synchronized:', data);
        const typedData = (data || []) as UIVersion[];
        setVersions(typedData);
        
        // Simulate portal energy accumulation
        let energy = 0;
        const energyInterval = setInterval(() => {
          energy = Math.min(100, energy + 5);
          setPortalEnergy(energy);
        }, 1000);

        return () => clearInterval(energyInterval);
      } catch (error) {
        console.error('Portal synchronization failed:', error);
        toast({
          variant: "destructive",
          title: "Dimensional Rift Error",
          description: "Failed to stabilize portal gateway"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();

    const channel = supabase
      .channel('portal-gateway')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ui_versions'
        },
        (payload) => {
          console.log('Portal dimension shift detected:', payload);
          if (payload.eventType === 'INSERT') {
            setVersions(prev => [payload.new as UIVersion, ...prev]);
            toast({
              title: "New Reality Branch Detected! 🌟",
              description: "A new dimensional pathway has been discovered",
            });
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
        title: "Portal Access Denied",
        description: "Dimensional key required for reality anchoring",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ui_versions')
        .insert({
          name: `Reality Branch ${new Date().toLocaleString()}`,
          route: window.location.pathname,
          component_data: {},
          created_by: session.user.id,
          metadata: {
            portal_energy: portalEnergy,
            dimension_stability: Math.random() * 100
          }
        });

      if (error) throw error;

      toast({
        title: "Reality Branch Preserved ✨",
        description: "Current dimensional state has been anchored",
      });
    } catch (error) {
      console.error('Reality anchoring failed:', error);
      toast({
        variant: "destructive",
        title: "Dimensional Collapse",
        description: "Failed to preserve reality branch"
      });
    }
  };

  return (
    <Card className="w-full bg-gray-900/50 border-gray-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 animate-pulse" />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-sm text-gray-200">Portal Gateway</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={saveCurrentVersion}
            className="gap-2 bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50"
          >
            <Rocket className="h-4 w-4" />
            Anchor Reality
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Portal Energy</span>
            <span className="text-purple-400">{portalEnergy}%</span>
          </div>
          <Progress value={portalEnergy} className="h-2 bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 animate-pulse" />
          </Progress>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Zap className="h-12 w-12 mb-4 text-purple-400 animate-pulse" />
            <p>Portal Window Awaiting First Reality Branch</p>
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-medium text-gray-200 flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-400" />
                      {version.name}
                    </h4>
                    {version.description && (
                      <p className="text-xs text-gray-400">{version.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/50">
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