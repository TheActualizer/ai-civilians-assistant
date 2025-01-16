import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Cpu, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { AgentMetricsData } from '@/types/agent';

export default function AgentMetrics() {
  const [metrics, setMetrics] = useState<AgentMetricsData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        console.log("Fetching agent metrics...");
        const { data, error } = await supabase
          .from('agent_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        console.log("Fetched agent metrics:", data);
        setMetrics(data || []);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        toast({
          variant: "destructive",
          title: "Error fetching metrics",
          description: "Failed to load agent metrics data"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [toast]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Agent Metrics</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.cpuUsage}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Agent Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">CPU Usage</span>
                    <span className="font-medium">{metric.cpuUsage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Memory Usage</span>
                    <span className="font-medium">{metric.memoryUsage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Network Latency</span>
                    <span className="font-medium">{metric.networkLatency}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}