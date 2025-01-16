import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { AgentMetricsState } from "./types";
import { motion } from "framer-motion";

interface MetricsPanelProps {
  metrics: AgentMetricsState;
}

export const MetricsPanel = ({ metrics }: MetricsPanelProps) => {
  return (
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
              {metrics.activeAgents}
            </span>
          </div>
          <motion.div 
            className="h-2 bg-gray-700 rounded-full overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="h-2 rounded-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.activeAgents / 10) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">System Load</span>
            <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300">
              {metrics.systemLoad}%
            </span>
          </div>
          <motion.div 
            className="h-2 bg-gray-700 rounded-full overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="h-2 rounded-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${metrics.systemLoad}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Network Health</span>
            <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
              {100 - metrics.networkLatency}%
            </span>
          </div>
          <motion.div 
            className="h-2 bg-gray-700 rounded-full overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="h-2 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${100 - metrics.networkLatency}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};