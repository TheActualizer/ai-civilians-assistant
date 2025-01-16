import { supabase } from "@/integrations/supabase/client";

export async function testSystemLogs() {
  console.log('🧪 Starting system log tests...');

  try {
    // Test 1: Basic log insertion
    const { data: basicLog, error: basicError } = await supabase
      .from('system_intelligence_logs')
      .insert({
        log_type: 'test',
        component: 'infrastructure',
        metrics: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          latency: Math.random() * 50
        }
      })
      .select()
      .single();

    console.log('📝 Basic log test:', basicLog ? 'Success' : 'Failed', basicError || '');

    // Test 2: Complex metrics
    const { data: complexLog, error: complexError } = await supabase
      .from('system_intelligence_logs')
      .insert({
        log_type: 'integration_test',
        component: 'infrastructure',
        metrics: {
          performance: {
            frontend: {
              renderTime: Math.random() * 100,
              memoryUsage: Math.random() * 1000,
              fps: 60 * Math.random()
            },
            backend: {
              queryTime: Math.random() * 50,
              cacheHitRate: Math.random(),
              activeConnections: Math.floor(Math.random() * 100)
            }
          }
        },
        analysis_data: {
          patterns: ['high_load', 'cache_miss', 'network_latency'],
          recommendations: [
            'Optimize query performance',
            'Increase cache size',
            'Load balance connections'
          ]
        }
      })
      .select()
      .single();

    console.log('🔍 Complex metrics test:', complexLog ? 'Success' : 'Failed', complexError || '');

    // Test 3: Pattern Analysis
    const { data: patterns, error: patternError } = await supabase
      .rpc('analyze_system_patterns', { time_window: '1 hour' });

    console.log('📊 Pattern analysis test:', patterns ? 'Success' : 'Failed', patternError || '');
    console.log('Found patterns:', patterns);

    return {
      success: !basicError && !complexError && !patternError,
      results: {
        basicLog,
        complexLog,
        patterns
      }
    };

  } catch (error) {
    console.error('❌ Error during log testing:', error);
    return {
      success: false,
      error
    };
  }
}