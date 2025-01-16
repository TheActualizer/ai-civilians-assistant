import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SystemLog {
  source: 'frontend' | 'backend' | 'integration';
  level: 'debug' | 'info' | 'warning' | 'error';
  context: {
    component?: string;
    route?: string;
    timestamp: string;
    metrics?: {
      executionTime?: number;
      memoryUsage?: number;
      apiLatency?: number;
    };
    trace?: string[];
  };
  message: string;
  metadata: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { log, analysis_type = 'standard' } = await req.json() as { 
      log: SystemLog;
      analysis_type: 'standard' | 'deep' | 'predictive'
    }

    console.log('📊 Processing system log:', { type: analysis_type, log })

    // Store the log with advanced metrics
    const { data: logData, error: logError } = await supabase
      .from('debug_logs')
      .insert({
        level: log.level,
        message: log.message,
        source: log.source,
        context: log.context,
        metadata: {
          ...log.metadata,
          analysis_type,
          system_metrics: {
            timestamp: new Date().toISOString(),
            execution_context: {
              source: log.source,
              component: log.context.component,
              route: log.context.route
            },
            performance_metrics: {
              execution_time: log.context.metrics?.executionTime,
              memory_usage: log.context.metrics?.memoryUsage,
              api_latency: log.context.metrics?.apiLatency
            },
            trace_analysis: log.context.trace
          }
        }
      })
      .select()
      .single()

    if (logError) throw logError

    // Perform real-time analysis
    const analysisResult = await performSystemAnalysis(supabase, log, analysis_type)
    
    // Update thread analysis for AI agents
    await updateThreadAnalysis(supabase, log, analysisResult)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          log: logData,
          analysis: analysisResult
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error in system logging analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function performSystemAnalysis(
  supabase: any,
  log: SystemLog,
  analysisType: string
) {
  console.log('🔍 Performing system analysis:', { type: analysisType })

  // Get recent logs for pattern analysis
  const { data: recentLogs } = await supabase
    .from('debug_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // Analyze patterns and performance
  const patterns = analyzePatterns(recentLogs || [])
  const performance = analyzePerformance(log, recentLogs || [])
  const optimization = generateOptimizationSuggestions(patterns, performance)

  return {
    timestamp: new Date().toISOString(),
    patterns,
    performance,
    optimization,
    analysis_type: analysisType,
    confidence_score: calculateConfidenceScore(patterns, performance)
  }
}

async function updateThreadAnalysis(
  supabase: any,
  log: SystemLog,
  analysis: any
) {
  console.log('🧵 Updating thread analysis')

  const { data, error } = await supabase
    .from('debug_thread_analysis')
    .insert({
      page_path: log.context.route || '/',
      thread_type: 'system_logging',
      analysis_status: 'completed',
      analysis_data: {
        log_context: log.context,
        analysis_result: analysis,
        system_impact: calculateSystemImpact(analysis)
      },
      auto_analysis_enabled: true,
      analysis_frequency: 60,
      system_load: {
        cpu: log.context.metrics?.memoryUsage || 0,
        memory: log.context.metrics?.memoryUsage || 0,
        network: log.context.metrics?.apiLatency || 0
      }
    })

  if (error) {
    console.error('Error updating thread analysis:', error)
  }
}

function analyzePatterns(logs: any[]) {
  const patterns = {
    error_frequency: logs.filter(l => l.level === 'error').length / logs.length,
    common_paths: findCommonPaths(logs),
    performance_trends: analyzePerformanceTrends(logs),
    integration_points: findIntegrationPoints(logs)
  }

  return patterns
}

function analyzePerformance(currentLog: SystemLog, historicalLogs: any[]) {
  return {
    current_metrics: currentLog.context.metrics,
    historical_average: calculateHistoricalAverage(historicalLogs),
    anomalies: detectAnomalies(currentLog, historicalLogs),
    optimization_potential: assessOptimizationPotential(currentLog, historicalLogs)
  }
}

function generateOptimizationSuggestions(patterns: any, performance: any) {
  return {
    high_priority: generatePrioritySuggestions(patterns, performance, 'high'),
    medium_priority: generatePrioritySuggestions(patterns, performance, 'medium'),
    low_priority: generatePrioritySuggestions(patterns, performance, 'low')
  }
}

function calculateConfidenceScore(patterns: any, performance: any): number {
  const patternConfidence = 1 - patterns.error_frequency
  const performanceConfidence = performance.anomalies.length === 0 ? 1 : 0.7
  return Math.round((patternConfidence + performanceConfidence) * 50)
}

function calculateSystemImpact(analysis: any) {
  return {
    reliability_impact: 1 - analysis.patterns.error_frequency,
    performance_impact: analysis.performance.optimization_potential,
    integration_health: calculateIntegrationHealth(analysis)
  }
}

// Utility functions
function findCommonPaths(logs: any[]) {
  const pathCounts = logs.reduce((acc: any, log: any) => {
    const path = log.context?.route || 'unknown'
    acc[path] = (acc[path] || 0) + 1
    return acc
  }, {})
  
  return Object.entries(pathCounts)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5)
}

function analyzePerformanceTrends(logs: any[]) {
  return logs.reduce((acc: any, log: any) => {
    const metrics = log.context?.metrics || {}
    Object.entries(metrics).forEach(([key, value]: [string, any]) => {
      if (!acc[key]) acc[key] = []
      acc[key].push(value)
    })
    return acc
  }, {})
}

function findIntegrationPoints(logs: any[]) {
  return logs
    .filter(log => log.source === 'integration')
    .reduce((acc: any, log: any) => {
      const point = log.context?.component || 'unknown'
      acc[point] = (acc[point] || 0) + 1
      return acc
    }, {})
}

function calculateHistoricalAverage(logs: any[]) {
  return logs.reduce((acc: any, log: any) => {
    const metrics = log.context?.metrics || {}
    Object.entries(metrics).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'number') {
        if (!acc[key]) acc[key] = { sum: 0, count: 0 }
        acc[key].sum += value
        acc[key].count++
      }
    })
    return acc
  }, {})
}

function detectAnomalies(currentLog: SystemLog, historicalLogs: any[]) {
  const anomalies = []
  const metrics = currentLog.context.metrics || {}
  const averages = calculateHistoricalAverage(historicalLogs)

  for (const [key, value] of Object.entries(metrics)) {
    if (typeof value === 'number' && averages[key]) {
      const avg = averages[key].sum / averages[key].count
      if (value > avg * 2) {
        anomalies.push({ metric: key, value, average: avg })
      }
    }
  }

  return anomalies
}

function assessOptimizationPotential(currentLog: SystemLog, historicalLogs: any[]) {
  const metrics = currentLog.context.metrics || {}
  const averages = calculateHistoricalAverage(historicalLogs)
  
  return Object.entries(metrics).reduce((acc: any, [key, value]: [string, any]) => {
    if (typeof value === 'number' && averages[key]) {
      const avg = averages[key].sum / averages[key].count
      acc[key] = (value - avg) / avg
    }
    return acc
  }, {})
}

function generatePrioritySuggestions(patterns: any, performance: any, priority: string) {
  const suggestions = []

  if (priority === 'high') {
    if (patterns.error_frequency > 0.1) {
      suggestions.push('Implement error boundary and recovery mechanisms')
    }
    if (performance.anomalies.length > 0) {
      suggestions.push('Investigate and optimize performance bottlenecks')
    }
  }

  if (priority === 'medium') {
    if (Object.keys(patterns.integration_points).length > 5) {
      suggestions.push('Consider consolidating integration points')
    }
  }

  if (priority === 'low') {
    suggestions.push('Monitor and optimize resource usage')
  }

  return suggestions
}

function calculateIntegrationHealth(analysis: any) {
  const errorImpact = 1 - analysis.patterns.error_frequency
  const performanceImpact = analysis.performance.anomalies.length === 0 ? 1 : 0.8
  return Math.round((errorImpact + performanceImpact) * 50)
}