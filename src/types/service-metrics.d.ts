export interface ServiceMetric {
  name: string;
  value: number;
  status: 'healthy' | 'degraded' | 'error';
}

export interface ServiceLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  status: 'active' | 'inactive';
  metrics: ServiceMetric[];
}

export interface SystemLoad {
  cpu: number;
  memory: number;
  network: number;
}

export interface NetworkStats {
  latency: number[];
  bandwidth: number[];
  connections: number[];
}

export interface PerformanceMetrics {
  response_time: number[];
  success_rate: number[];
  error_rate: number[];
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  style: string;
}