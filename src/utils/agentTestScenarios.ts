import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type TestScenario = {
  name: string;
  description: string;
  run: () => Promise<void>;
};

export const testScenarios: TestScenario[] = [
  {
    name: "Agent Interaction Flow",
    description: "Tests a complete agent interaction flow with multiple steps",
    run: async () => {
      console.log("Starting Agent Interaction Flow test");
      
      try {
        // Create parent interaction
        const { data: parentInteraction, error: parentError } = await supabase
          .rpc('log_agent_interaction', {
            agent_id: 'test-agent',
            action: 'start_flow',
            details: { test: true, scenario: 'interaction_flow' }
          });

        if (parentError) throw parentError;
        console.log("Created parent interaction:", parentInteraction);

        // Create child interaction
        const { error: childError } = await supabase
          .rpc('log_agent_interaction', {
            agent_id: 'test-agent',
            action: 'process_data',
            details: { step: 'data_processing' },
            parent_interaction_id: parentInteraction
          });

        if (childError) throw childError;
        console.log("Created child interaction");

        // Update agent metrics
        const { error: metricsError } = await supabase
          .from('agent_metrics')
          .insert({
            cpu_usage: 45.5,
            memory_usage: 60.2,
            network_latency: 120,
            active_flows: 1,
            success_rate: 98.5,
            total_interactions: 1,
            system_load: {
              cpu_threads: [45, 50, 55],
              io_operations: [100, 120, 90],
              memory_allocation: [500, 520, 510]
            },
            network_metrics: {
              bandwidth_usage: [1000, 1200, 1100],
              connection_pool: [5, 5, 6],
              latency_history: [100, 120, 110]
            },
            performance_indicators: {
              error_rate: [0.1, 0.2, 0.1],
              throughput: [100, 110, 105],
              response_times: [50, 55, 52]
            }
          });

        if (metricsError) throw metricsError;
        console.log("Updated agent metrics");

        // Log system event
        const { error: eventError } = await supabase
          .from('system_events')
          .insert({
            event_type: 'test_execution',
            component: 'agent_monitoring',
            severity: 'info',
            details: { test: true, scenario: 'interaction_flow' },
            related_agents: ['test-agent']
          });

        if (eventError) throw eventError;
        console.log("Logged system event");

        toast({
          title: "Test Scenario Completed",
          description: "Agent Interaction Flow test executed successfully",
        });
      } catch (error) {
        console.error("Test scenario failed:", error);
        toast({
          variant: "destructive",
          title: "Test Scenario Failed",
          description: error.message,
        });
      }
    }
  },
  {
    name: "High Load Simulation",
    description: "Simulates high system load to test monitoring",
    run: async () => {
      console.log("Starting High Load Simulation test");
      
      try {
        // Update agent metrics with high load values
        const { error: metricsError } = await supabase
          .from('agent_metrics')
          .insert({
            cpu_usage: 95.5,
            memory_usage: 88.2,
            network_latency: 250,
            active_flows: 10,
            success_rate: 75.5,
            total_interactions: 1000,
            system_load: {
              cpu_threads: [90, 95, 92],
              io_operations: [500, 520, 510],
              memory_allocation: [1500, 1520, 1510]
            },
            network_metrics: {
              bandwidth_usage: [5000, 5200, 5100],
              connection_pool: [20, 22, 21],
              latency_history: [200, 250, 220]
            },
            performance_indicators: {
              error_rate: [5.1, 5.2, 5.0],
              throughput: [50, 45, 48],
              response_times: [250, 255, 252]
            }
          });

        if (metricsError) throw metricsError;
        console.log("Updated high load metrics");

        // Log system event for high load
        const { error: eventError } = await supabase
          .from('system_events')
          .insert({
            event_type: 'high_load_test',
            component: 'agent_monitoring',
            severity: 'warning',
            details: { test: true, scenario: 'high_load' },
            related_agents: ['test-agent']
          });

        if (eventError) throw eventError;
        console.log("Logged high load system event");

        toast({
          title: "Test Scenario Completed",
          description: "High Load Simulation executed successfully",
        });
      } catch (error) {
        console.error("Test scenario failed:", error);
        toast({
          variant: "destructive",
          title: "Test Scenario Failed",
          description: error.message,
        });
      }
    }
  }
];