import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, Server } from 'lucide-react';
import { enterpriseIntegrationService } from '@/services/enterprise/EnterpriseIntegrationService';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { ApiMetric } from '@/types/agent';

export const IntegrationMetricsPanel = () => {
  const [selectedService, setSelectedService] = useState<string | undefined>();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['enterprise-integration-metrics', selectedService],
    queryFn: () => enterpriseIntegrationService.getIntegrationMetrics(selectedService),
  });

  const renderMetricCard = (metric: ApiMetric) => (
    <motion.div
      key={`${metric.service_name}-${metric.endpoint}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className="p-4 bg-gray-900/50 border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-400" />
            <h3 className="font-semibold text-gray-200">{metric.service_name}</h3>
          </div>
          <Badge variant={metric.success_rate > 99 ? "default" : "destructive"}>
            {metric.success_rate}% Success
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-400">Response Time</p>
            <p className="text-lg font-semibold text-gray-200">
              {metric.response_time?.toFixed(2)}ms
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Error Count</p>
            <p className="text-lg font-semibold text-gray-200">
              {metric.error_count}
            </p>
          </div>
        </div>

        {metric.system_metrics && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-gray-400">CPU</p>
                <p className="text-sm font-medium text-gray-300">
                  {metric.system_metrics.cpu}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Memory</p>
                <p className="text-sm font-medium text-gray-300">
                  {metric.system_metrics.memory}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Network</p>
                <p className="text-sm font-medium text-gray-300">
                  {metric.system_metrics.network}%
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Activity className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-200">Integration Metrics</h2>
      <ScrollArea className="h-[600px] pr-4">
        {metrics?.map(renderMetricCard)}
      </ScrollArea>
    </div>
  );
};