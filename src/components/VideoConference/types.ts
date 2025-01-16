import { SystemLoad, NetworkStats, PerformanceMetrics } from "@/types/service-metrics";

export interface AgentMetricsState {
  activeAgents: number;
  processedTasks: number;
  systemLoad: number;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
}

export interface VideoMetrics {
  latency: number[];
  bandwidth: number[];
  quality: number[];
  frameRate: number[];
}

export interface ServiceLocation {
  lat: number;
  lng: number;
  name: string;
  status: 'active' | 'inactive';
  metrics: {
    latency: number;
    uptime: number;
    load: number;
  };
}

export interface VideoState {
  isActive: boolean;
  participants: string[];
  quality: number;
  bandwidth: number;
}