import type { 
  SystemLoad, 
  NetworkStats, 
  PerformanceMetrics, 
  ThreadAnalysis, 
  ApiMetric 
} from '@/types/agent';

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
    service_name: data.service_name,
    response_time: Number(data.response_time) || 0,
    success_rate: Number(data.success_rate) || 0,
    error_count: Number(data.error_count) || 0,
    total_requests: Number(data.total_requests) || 0,
    system_metrics: transformSystemLoad(data.system_metrics),
    timestamp: data.created_at || new Date().toISOString()
  };
}