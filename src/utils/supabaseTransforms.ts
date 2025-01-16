import type { SystemLoad, NetworkStats, PerformanceMetrics, ThreadAnalysis, ApiMetric, ServiceHealth } from '@/types/agent';

export function transformSystemLoad(data: any): SystemLoad {
  return {
    cpu: Number(data?.cpu) || 0,
    memory: Number(data?.memory) || 0,
    network: Number(data?.network) || 0,
    cpu_threads: Array.isArray(data?.cpu_threads) ? data.cpu_threads : [],
    io_operations: Array.isArray(data?.io_operations) ? data.io_operations : [],
    memory_allocation: Array.isArray(data?.memory_allocation) ? data.memory_allocation : []
  };
}

export function transformNetworkStats(data: any): NetworkStats {
  return {
    latency: Array.isArray(data?.latency) ? data.latency : [],
    bandwidth: Array.isArray(data?.bandwidth) ? data.bandwidth : [],
    connections: Array.isArray(data?.connections) ? data.connections : [],
    bandwidth_usage: Array.isArray(data?.bandwidth_usage) ? data.bandwidth_usage : [],
    connection_pool: Array.isArray(data?.connection_pool) ? data.connection_pool : [],
    latency_history: Array.isArray(data?.latency_history) ? data.latency_history : []
  };
}

export function transformPerformanceMetrics(data: any): PerformanceMetrics {
  return {
    response_time: Array.isArray(data?.response_time) ? data.response_time : [],
    success_rate: Array.isArray(data?.success_rate) ? data.success_rate : [],
    error_rate: Array.isArray(data?.error_rate) ? data.error_rate : [],
    throughput: Array.isArray(data?.throughput) ? data.throughput : [],
    response_times: Array.isArray(data?.response_times) ? data.response_times : []
  };
}

export function transformThreadAnalysis(data: any): ThreadAnalysis {
  return {
    id: data.id,
    page_path: data.page_path,
    thread_type: data.thread_type,
    system_load: transformSystemLoad(data.system_load),
    performance_metrics: transformPerformanceMetrics(data.performance_metrics),
    network_stats: transformNetworkStats(data.network_stats),
    analysis_status: data.analysis_status || 'pending',
    last_analysis_timestamp: data.last_analysis_timestamp || new Date().toISOString(),
    connection_status: data.connection_status || 'pending',
    connection_score: Number(data.connection_score) || 0,
    analysis_data: data.analysis_data || {},
    agent_states: data.agent_states || {},
    agent_feedback: data.agent_feedback || {},
    auto_analysis_enabled: Boolean(data.auto_analysis_enabled),
    analysis_interval: Number(data.analysis_interval) || 60000
  };
}

export function transformApiMetric(data: any): ApiMetric {
  return {
    endpoint: data.endpoint,
    responseTime: Number(data.response_time) || 0,
    successRate: Number(data.success_rate) || 0,
    errorCount: Number(data.error_count) || 0,
    timestamp: data.created_at || new Date().toISOString(),
    service_name: data.service_name,
    system_metrics: data.system_metrics ? {
      cpu: Number(data.system_metrics.cpu) || 0,
      memory: Number(data.system_metrics.memory) || 0,
      network: Number(data.system_metrics.network) || 0
    } : undefined
  };
}

export function transformServiceHealth(data: any): ServiceHealth {
  return {
    service_name: data.service_name,
    status: data.status as 'healthy' | 'degraded' | 'down',
    uptime_percentage: Number(data.uptime_percentage) || 0,
    resource_usage: {
      cpu: Number(data.resource_usage?.cpu) || 0,
      memory: Number(data.resource_usage?.memory) || 0,
      network: Number(data.resource_usage?.network) || 0
    },
    last_check: new Date(data.last_check),
    alerts: Array.isArray(data.alerts) ? data.alerts : [],
    dependencies: Array.isArray(data.dependencies) ? data.dependencies : []
  };
}