import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Zap, Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UnityVisualizationProps {
  sessionId?: string;
}

export function UnityVisualization({ sessionId }: UnityVisualizationProps) {
  const [unityState, setUnityState] = useState<{
    agentCount: number;
    activeFlows: number;
    performance: number;
    lastUpdate: string;
  }>({
    agentCount: 0,
    activeFlows: 0,
    performance: 0,
    lastUpdate: new Date().toISOString()
  });

  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Initializing Unity visualization system');
    
    const channel = supabase.channel('unity-visualization')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'unity_game_state',
          filter: sessionId ? `session_id=eq.${sessionId}` : undefined
        },
        (payload) => {
          console.log('Unity state update received:', payload);
          
          if (payload.new) {
            const gameState = payload.new.game_state || {};
            const metrics = payload.new.metrics || {};
            
            setUnityState({
              agentCount: metrics.active_agents || 0,
              activeFlows: metrics.active_flows || 0,
              performance: metrics.performance || 0,
              lastUpdate: new Date().toISOString()
            });

            toast({
              title: "Unity Visualization Updated",
              description: `${metrics.active_agents || 0} agents active`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Unity visualization subscription');
      supabase.removeChannel(channel);
    };
  }, [sessionId, toast]);

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              <Brain className="h-4 w-4 text-blue-400 inline mr-2" />
              Active Agents
            </CardTitle>
            <Badge variant="outline" className="bg-blue-500/10">
              {unityState.agentCount}
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={unityState.agentCount * 10} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              <Activity className="h-4 w-4 text-purple-400 inline mr-2" />
              Active Flows
            </CardTitle>
            <Badge variant="outline" className="bg-purple-500/10">
              {unityState.activeFlows}
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={unityState.activeFlows * 10} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              <Zap className="h-4 w-4 text-green-400 inline mr-2" />
              Performance
            </CardTitle>
            <Badge variant="outline" className="bg-green-500/10">
              {unityState.performance}%
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={unityState.performance} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>

      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            Unity Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={containerRef}
            className="h-[400px] rounded-lg border border-gray-700 bg-black/50 flex items-center justify-center"
          >
            <div id="unity-container" className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}