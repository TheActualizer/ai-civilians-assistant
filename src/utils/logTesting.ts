import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function testSystemLogs() {
  console.log("Starting system log tests...");

  try {
    // Test basic log insertion
    const { data: basicLog, error: basicError } = await supabase
      .from('system_intelligence_logs')
      .insert({
        log_type: 'test',
        component: 'log-tester',
        metrics: {
          test_value: 100,
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (basicError) throw basicError;
    console.log("Basic log created:", basicLog);

    // Test complex metrics logging
    const { data: complexLog, error: complexError } = await supabase
      .from('system_intelligence_logs')
      .insert({
        log_type: 'complex-test',
        component: 'log-tester',
        metrics: {
          performance: {
            cpu: 45,
            memory: 80,
            latency: 120
          },
          timestamps: {
            start: new Date().toISOString(),
            end: new Date().toISOString()
          }
        },
        integration_metrics: {
          frontend: {
            errors: [],
            latency: [120, 130, 140],
            performance: {
              fps: 60,
              renderTime: 16
            }
          }
        }
      })
      .select()
      .single();

    if (complexError) throw complexError;
    console.log("Complex log created:", complexLog);

    // Test pattern analysis
    const { data: patterns, error: patternError } = await supabase
      .rpc('analyze_system_patterns', {
        time_window: '1 hour'
      });

    if (patternError) throw patternError;
    console.log("Pattern analysis results:", patterns);

    toast({
      title: "Log tests completed",
      description: "All system log tests completed successfully",
      variant: "success"
    });

  } catch (error) {
    console.error("Error during log testing:", error);
    toast({
      title: "Log test error",
      description: error.message,
      variant: "destructive"
    });
  }
}