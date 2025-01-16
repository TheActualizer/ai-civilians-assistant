import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VideoPanel } from './VideoPanel';
import { MetricsPanel } from './MetricsPanel';
import { MapPanel } from './MapPanel';
import { VideoState, AgentMetricsState, ServiceLocation } from './types';

const defaultMetrics: AgentMetricsState = {
  activeAgents: 0,
  processedTasks: 0,
  systemLoad: 0,
  cpuUsage: 0,
  memoryUsage: 0,
  networkLatency: 0
};

const mockLocations: ServiceLocation[] = [
  {
    lat: 40.7128,
    lng: -74.0060,
    name: "New York Hub",
    status: "active",
    metrics: { latency: 15, uptime: 99.9, load: 45 }
  },
  {
    lat: 37.7749,
    lng: -122.4194,
    name: "SF Hub",
    status: "active",
    metrics: { latency: 20, uptime: 99.5, load: 65 }
  }
];

export function IntegratedVideoView() {
  const session = useSession();
  const { toast } = useToast();
  const [videoState, setVideoState] = useState<VideoState>({
    isActive: false,
    participants: [],
    quality: 100,
    bandwidth: 0
  });
  const [metrics, setMetrics] = useState<AgentMetricsState>(defaultMetrics);

  useEffect(() => {
    console.log("Initializing integrated view...");
    
    const metricsChannel = supabase.channel('agent-metrics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'agent_metrics'
      }, (payload) => {
        console.log('Agent metric update:', payload);
        if (payload.new) {
          const data = payload.new;
          setMetrics({
            activeAgents: data.active_flows || 0,
            processedTasks: data.total_interactions || 0,
            systemLoad: data.cpu_usage || 0,
            cpuUsage: data.cpu_usage || 0,
            memoryUsage: data.memory_usage || 0,
            networkLatency: data.network_latency || 0
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(metricsChannel);
    };
  }, []);

  const toggleVideo = async () => {
    try {
      const newState = !videoState.isActive;
      setVideoState(prev => ({
        ...prev,
        isActive: newState,
        participants: newState ? ['User 1', 'User 2'] : []
      }));
      
      toast({
        title: newState ? "Video Started" : "Video Stopped",
        description: newState ? "Joining video conference..." : "Video conference ended"
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
          <VideoPanel 
            videoState={videoState}
            onToggleVideo={toggleVideo}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricsPanel metrics={metrics} />
        </motion.div>

        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MapPanel locations={mockLocations} />
        </motion.div>
      </div>
    </div>
  );
}