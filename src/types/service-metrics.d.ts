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

export interface MapConfig {
  center: [number, number];
  zoom: number;
  style: string;
}