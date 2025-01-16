import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';
import { Video, Map as MapIcon, Activity, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ServiceMetric } from '@/types/service-metrics';

interface ServiceLocation {
  lat: number;
  lng: number;
  name: string;
  status: 'active' | 'inactive';
}

interface MapConfig {
  center: [number, number];
  zoom: number;
  style: string;
}

const defaultMapConfig: MapConfig = {
  center: [-74.5, 40],
  zoom: 9,
  style: 'mapbox://styles/mapbox/dark-v11'
};

export function IntegratedVideoView() {
  const session = useSession();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [metrics, setMetrics] = useState<ServiceMetric[]>([
    { name: 'Video Latency', value: 98, status: 'healthy' },
    { name: 'Network Speed', value: 95, status: 'healthy' },
    { name: 'CPU Usage', value: 45, status: 'healthy' },
    { name: 'Memory', value: 60, status: 'healthy' }
  ]);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [agentMetrics, setAgentMetrics] = useState({
    activeAgents: 0,
    processedTasks: 0,
    systemLoad: 0
  });

  useEffect(() => {
    console.log('Initializing integrated view...');
    
    if (mapContainer.current && !map.current) {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        console.error('Mapbox token not found');
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "Mapbox token is missing"
        });
        return;
      }

      mapboxgl.accessToken = token;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        ...defaultMapConfig,
        pitch: 45
      });

      map.current.addControl(new mapboxgl.NavigationControl());
    }

    // Subscribe to real-time service metrics
    const metricsChannel = supabase.channel('service-metrics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'microservice_registry'
      }, (payload) => {
        console.log('Service metric update:', payload);
        if (payload.new) {
          const data = payload.new;
          setMetrics(prev => [
            { name: 'Video Latency', value: data.performance_metrics?.latency || prev[0].value, status: 'healthy' },
            { name: 'Network Speed', value: data.performance_metrics?.throughput || prev[1].value, status: 'healthy' },
            { name: 'CPU Usage', value: data.performance_metrics?.cpu || prev[2].value, status: 'healthy' },
            { name: 'Memory', value: data.performance_metrics?.memory || prev[3].value, status: 'healthy' }
          ]);
        }
      })
      .subscribe();

    // Subscribe to agent metrics
    const agentChannel = supabase.channel('agent-metrics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'agent_metrics'
      }, (payload) => {
        console.log('Agent metric update:', payload);
        if (payload.new) {
          setAgentMetrics({
            activeAgents: payload.new.active_flows || 0,
            processedTasks: payload.new.total_interactions || 0,
            systemLoad: payload.new.cpu_usage || 0
          });
        }
      })
      .subscribe();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      supabase.removeChannel(metricsChannel);
      supabase.removeChannel(agentChannel);
    };
  }, [toast]);

  const toggleVideo = async () => {
    try {
      setIsVideoActive(!isVideoActive);
      toast({
        title: isVideoActive ? "Video Stopped" : "Video Started",
        description: isVideoActive ? "Video conference ended" : "Joining video conference..."
      });
    } catch (error) {
      console.error('Error toggling video:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle video conference"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Video Conference
                </CardTitle>
                <Button
                  variant={isVideoActive ? "destructive" : "default"}
                  onClick={toggleVideo}
                  className="gap-2"
                >
                  <Video className="h-4 w-4" />
                  {isVideoActive ? "End Call" : "Start Call"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-black/50 flex items-center justify-center">
                {isVideoActive ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Video Conference Active</span>
                  </div>
                ) : (
                  <Video className="h-16 w-16 text-gray-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Agent Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Active Agents</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">
                    {agentMetrics.activeAgents}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${(agentMetrics.activeAgents / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Processed Tasks</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                    {agentMetrics.processedTasks}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(agentMetrics.processedTasks / 100) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">System Load</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300">
                    {agentMetrics.systemLoad}%
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{ width: `${agentMetrics.systemLoad}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" />
                Service Distribution Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={mapContainer}
                className="h-[400px] rounded-lg overflow-hidden"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}