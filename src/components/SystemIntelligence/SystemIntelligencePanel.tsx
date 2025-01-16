import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, Activity, AlertCircle, Cpu, BarChart } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SystemAnalysis {
  metrics: any;
  patterns: any;
  insights: string[];
  correlations: any[];
  predictions: any[];
  recommendations: any[];
}

export function SystemIntelligencePanel() {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<SystemAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      try {
        const { data, error } = await supabase
          .from('system_analysis_intelligence')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        setAnalysis(data);
        console.log('Fetched latest system analysis:', data);
      } catch (error) {
        console.error('Error fetching system analysis:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch system analysis data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAnalysis();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('system-intelligence')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_analysis_intelligence'
        },
        (payload) => {
          console.log('Received new system analysis:', payload);
          setAnalysis(payload.new as SystemAnalysis);
          
          toast({
            title: "Analysis Updated",
            description: "New system intelligence data available",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle className="text-gray-100">System Intelligence</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <Activity className="h-8 w-8 text-gray-400 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-gray-100">System Intelligence</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400">
            No analysis data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-gray-100">System Intelligence</CardTitle>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-6">
            {/* System Health */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                System Health
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400">CPU Usage</div>
                  <div className="text-xl font-semibold text-primary">
                    {analysis.metrics.system_health.cpu_usage.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400">Memory</div>
                  <div className="text-xl font-semibold text-primary">
                    {analysis.metrics.system_health.memory_usage.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400">Error Rate</div>
                  <div className="text-xl font-semibold text-primary">
                    {analysis.metrics.system_health.error_rate.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <BarChart className="h-4 w-4 text-primary" />
                Key Insights
              </h3>
              <div className="space-y-2">
                {analysis.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800/50 rounded-lg text-sm text-gray-300"
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-200">
                Recommendations
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        {recommendation.suggestion}
                      </span>
                      <Badge
                        variant="outline"
                        className={`
                          ${recommendation.priority === 'high' 
                            ? 'bg-red-500/10 text-red-400' 
                            : 'bg-yellow-500/10 text-yellow-400'}
                        `}
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}