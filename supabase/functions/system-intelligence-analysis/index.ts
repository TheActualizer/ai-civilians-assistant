import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting system intelligence analysis...');

    const { timestamp, analysis_type, layers } = await req.json();

    // Gather system metrics
    const { data: metricsData, error: metricsError } = await supabaseClient
      .from('system_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (metricsError) throw metricsError;

    // Analyze debug logs
    const { data: logsData, error: logsError } = await supabaseClient
      .from('debug_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (logsError) throw logsError;

    // Process and analyze the data
    const analysis = {
      timestamp,
      analysis_type,
      analysis_layer: layers[0],
      metrics: {
        system_health: calculateSystemHealth(metricsData),
        performance_trends: analyzePerformanceTrends(metricsData),
        error_patterns: analyzeErrorPatterns(logsData)
      },
      patterns: {
        usage_patterns: detectUsagePatterns(metricsData),
        error_clusters: identifyErrorClusters(logsData)
      },
      insights: generateInsights(metricsData, logsData),
      correlations: findCorrelations(metricsData, logsData),
      predictions: generatePredictions(metricsData),
      recommendations: generateRecommendations(metricsData, logsData)
    };

    // Store analysis results
    const { error: insertError } = await supabaseClient
      .from('system_analysis_intelligence')
      .insert([analysis]);

    if (insertError) throw insertError;

    console.log('System intelligence analysis completed successfully');

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in system intelligence analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Analysis helper functions
function calculateSystemHealth(metrics: any[]) {
  return {
    cpu_usage: calculateAverage(metrics.map(m => m.value).filter(v => v !== null)),
    memory_usage: calculatePercentile(metrics.map(m => m.value).filter(v => v !== null), 95),
    error_rate: calculateErrorRate(metrics)
  };
}

function analyzePerformanceTrends(metrics: any[]) {
  return {
    daily_trends: calculateDailyTrends(metrics),
    weekly_patterns: identifyWeeklyPatterns(metrics),
    anomalies: detectAnomalies(metrics)
  };
}

function analyzeErrorPatterns(logs: any[]) {
  return {
    common_errors: findCommonErrors(logs),
    error_frequency: calculateErrorFrequency(logs),
    error_impact: assessErrorImpact(logs)
  };
}

function detectUsagePatterns(metrics: any[]) {
  return {
    peak_hours: findPeakHours(metrics),
    quiet_periods: findQuietPeriods(metrics),
    usage_trends: analyzeUsageTrends(metrics)
  };
}

function identifyErrorClusters(logs: any[]) {
  return {
    error_groups: groupErrors(logs),
    error_sequences: findErrorSequences(logs),
    error_correlations: findErrorCorrelations(logs)
  };
}

function generateInsights(metrics: any[], logs: any[]) {
  return [
    analyzeSystemPerformance(metrics),
    identifyBottlenecks(metrics),
    suggestOptimizations(metrics, logs)
  ].filter(Boolean);
}

function findCorrelations(metrics: any[], logs: any[]) {
  return [
    correlateErrorsWithMetrics(metrics, logs),
    findPerformanceCorrelations(metrics),
    identifyImpactPatterns(metrics, logs)
  ].filter(Boolean);
}

function generatePredictions(metrics: any[]) {
  return [
    predictResourceNeeds(metrics),
    forecastPerformance(metrics),
    anticipateIssues(metrics)
  ].filter(Boolean);
}

function generateRecommendations(metrics: any[], logs: any[]) {
  return [
    suggestResourceOptimizations(metrics),
    recommendErrorPrevention(logs),
    proposePerformanceImprovements(metrics)
  ].filter(Boolean);
}

// Utility functions
function calculateAverage(values: number[]) {
  return values.length ? values.reduce((a, b) => a + b) / values.length : 0;
}

function calculatePercentile(values: number[], percentile: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index];
}

function calculateErrorRate(metrics: any[]) {
  const errorMetrics = metrics.filter(m => m.metric_type === 'error_count');
  return errorMetrics.length ? calculateAverage(errorMetrics.map(m => m.value)) : 0;
}

function calculateDailyTrends(metrics: any[]) {
  // Group metrics by day and calculate averages
  const dailyGroups = groupBy(metrics, m => new Date(m.timestamp).toDateString());
  return Object.fromEntries(
    Object.entries(dailyGroups).map(([date, values]) => [
      date,
      calculateAverage(values.map(v => v.value))
    ])
  );
}

function identifyWeeklyPatterns(metrics: any[]) {
  // Group metrics by day of week and find patterns
  const weeklyGroups = groupBy(metrics, m => new Date(m.timestamp).getDay());
  return Object.fromEntries(
    Object.entries(weeklyGroups).map(([day, values]) => [
      day,
      calculateAverage(values.map(v => v.value))
    ])
  );
}

function detectAnomalies(metrics: any[]) {
  const values = metrics.map(m => m.value);
  const avg = calculateAverage(values);
  const stdDev = calculateStdDev(values);
  return metrics.filter(m => Math.abs(m.value - avg) > 2 * stdDev);
}

function calculateStdDev(values: number[]) {
  const avg = calculateAverage(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(calculateAverage(squareDiffs));
}

function groupBy(array: any[], keyFn: (item: any) => string | number) {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    (result[key] = result[key] || []).push(item);
    return result;
  }, {});
}

// Analysis functions
function findCommonErrors(logs: any[]) {
  return groupBy(logs.filter(l => l.level === 'error'), l => l.message);
}

function calculateErrorFrequency(logs: any[]) {
  const errorLogs = logs.filter(l => l.level === 'error');
  return errorLogs.length / logs.length;
}

function assessErrorImpact(logs: any[]) {
  return groupBy(logs.filter(l => l.level === 'error'), l => l.source);
}

function findPeakHours(metrics: any[]) {
  const hourlyGroups = groupBy(metrics, m => new Date(m.timestamp).getHours());
  return Object.entries(hourlyGroups)
    .map(([hour, values]) => ({
      hour: parseInt(hour),
      average: calculateAverage(values.map(v => v.value))
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);
}

function findQuietPeriods(metrics: any[]) {
  const hourlyGroups = groupBy(metrics, m => new Date(m.timestamp).getHours());
  return Object.entries(hourlyGroups)
    .map(([hour, values]) => ({
      hour: parseInt(hour),
      average: calculateAverage(values.map(v => v.value))
    }))
    .sort((a, b) => a.average - b.average)
    .slice(0, 5);
}

function analyzeUsageTrends(metrics: any[]) {
  return {
    daily: calculateDailyTrends(metrics),
    weekly: identifyWeeklyPatterns(metrics),
    anomalies: detectAnomalies(metrics)
  };
}

function groupErrors(logs: any[]) {
  return groupBy(logs.filter(l => l.level === 'error'), l => l.source);
}

function findErrorSequences(logs: any[]) {
  const errorLogs = logs.filter(l => l.level === 'error');
  return errorLogs.map((log, i) => ({
    current: log,
    previous: i > 0 ? errorLogs[i - 1] : null,
    next: i < errorLogs.length - 1 ? errorLogs[i + 1] : null
  }));
}

function findErrorCorrelations(logs: any[]) {
  const errorGroups = groupBy(logs.filter(l => l.level === 'error'), l => l.source);
  return Object.entries(errorGroups).map(([source, errors]) => ({
    source,
    count: errors.length,
    frequency: errors.length / logs.length
  }));
}

function analyzeSystemPerformance(metrics: any[]) {
  return {
    overall_health: calculateSystemHealth(metrics),
    performance_trends: analyzePerformanceTrends(metrics),
    recommendations: generateRecommendations(metrics, [])
  };
}

function identifyBottlenecks(metrics: any[]) {
  const highUsageMetrics = metrics.filter(m => m.value > 80);
  return groupBy(highUsageMetrics, m => m.metric_type);
}

function suggestOptimizations(metrics: any[], logs: any[]) {
  return {
    resource_optimization: suggestResourceOptimizations(metrics),
    error_prevention: recommendErrorPrevention(logs),
    performance_improvements: proposePerformanceImprovements(metrics)
  };
}

function correlateErrorsWithMetrics(metrics: any[], logs: any[]) {
  const errorTimestamps = new Set(
    logs.filter(l => l.level === 'error').map(l => l.timestamp)
  );
  return metrics.filter(m => errorTimestamps.has(m.timestamp));
}

function findPerformanceCorrelations(metrics: any[]) {
  const correlations: any = {};
  const metricTypes = new Set(metrics.map(m => m.metric_type));
  
  metricTypes.forEach(type1 => {
    metricTypes.forEach(type2 => {
      if (type1 < type2) {
        const values1 = metrics.filter(m => m.metric_type === type1).map(m => m.value);
        const values2 = metrics.filter(m => m.metric_type === type2).map(m => m.value);
        correlations[`${type1}-${type2}`] = calculateCorrelation(values1, values2);
      }
    });
  });
  
  return correlations;
}

function calculateCorrelation(values1: number[], values2: number[]) {
  const n = Math.min(values1.length, values2.length);
  if (n === 0) return 0;

  const avg1 = calculateAverage(values1);
  const avg2 = calculateAverage(values2);
  
  let num = 0;
  let den1 = 0;
  let den2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = values1[i] - avg1;
    const diff2 = values2[i] - avg2;
    num += diff1 * diff2;
    den1 += diff1 * diff1;
    den2 += diff2 * diff2;
  }
  
  return num / Math.sqrt(den1 * den2);
}

function identifyImpactPatterns(metrics: any[], logs: any[]) {
  return {
    error_impact: assessErrorImpact(logs),
    performance_impact: analyzePerformanceImpact(metrics),
    correlation_patterns: findPerformanceCorrelations(metrics)
  };
}

function analyzePerformanceImpact(metrics: any[]) {
  return metrics
    .filter(m => m.value > 90)
    .map(m => ({
      metric_type: m.metric_type,
      timestamp: m.timestamp,
      value: m.value,
      impact: 'high'
    }));
}

function predictResourceNeeds(metrics: any[]) {
  const recentMetrics = metrics.slice(-24); // Last 24 data points
  return {
    cpu_prediction: predictMetricValue(recentMetrics.filter(m => m.metric_type === 'cpu_usage')),
    memory_prediction: predictMetricValue(recentMetrics.filter(m => m.metric_type === 'memory_usage')),
    network_prediction: predictMetricValue(recentMetrics.filter(m => m.metric_type === 'network_latency'))
  };
}

function predictMetricValue(metrics: any[]) {
  if (metrics.length < 2) return null;
  
  const values = metrics.map(m => m.value);
  const avg = calculateAverage(values);
  const trend = (values[values.length - 1] - values[0]) / values.length;
  
  return {
    current: values[values.length - 1],
    predicted: values[values.length - 1] + trend,
    trend: trend > 0 ? 'increasing' : 'decreasing',
    confidence: calculatePredictionConfidence(values)
  };
}

function calculatePredictionConfidence(values: number[]) {
  const stdDev = calculateStdDev(values);
  const avg = calculateAverage(values);
  return Math.max(0, Math.min(100, 100 * (1 - stdDev / avg)));
}

function forecastPerformance(metrics: any[]) {
  return {
    short_term: predictResourceNeeds(metrics.slice(-24)),
    medium_term: predictResourceNeeds(metrics.slice(-72)),
    long_term: predictResourceNeeds(metrics)
  };
}

function anticipateIssues(metrics: any[]) {
  const predictions = predictResourceNeeds(metrics);
  return Object.entries(predictions).map(([resource, prediction]) => ({
    resource,
    prediction,
    risk_level: assessRiskLevel(prediction),
    mitigation_suggestions: suggestMitigation(resource, prediction)
  }));
}

function assessRiskLevel(prediction: any) {
  if (!prediction) return 'unknown';
  const { predicted, trend, confidence } = prediction;
  if (predicted > 90 && confidence > 70) return 'high';
  if (predicted > 75 && confidence > 60) return 'medium';
  return 'low';
}

function suggestMitigation(resource: string, prediction: any) {
  if (!prediction) return [];
  const { predicted, trend } = prediction;
  
  const suggestions = [];
  if (predicted > 90) {
    suggestions.push(`Urgent: Scale ${resource} immediately`);
  } else if (predicted > 75) {
    suggestions.push(`Plan to scale ${resource} within 24 hours`);
  }
  if (trend === 'increasing') {
    suggestions.push(`Monitor ${resource} usage closely`);
  }
  return suggestions;
}

function suggestResourceOptimizations(metrics: any[]) {
  return metrics
    .filter(m => m.value > 75)
    .map(m => ({
      resource: m.metric_type,
      current_usage: m.value,
      suggestion: `Consider optimizing ${m.metric_type} usage`,
      priority: m.value > 90 ? 'high' : 'medium'
    }));
}

function recommendErrorPrevention(logs: any[]) {
  const errorPatterns = findErrorPatterns(logs);
  return Object.entries(errorPatterns).map(([pattern, frequency]) => ({
    pattern,
    frequency,
    suggestion: `Implement error handling for ${pattern}`,
    priority: frequency > 0.1 ? 'high' : 'medium'
  }));
}

function findErrorPatterns(logs: any[]) {
  return logs
    .filter(l => l.level === 'error')
    .reduce((patterns: any, log) => {
      patterns[log.message] = (patterns[log.message] || 0) + 1;
      return patterns;
    }, {});
}

function proposePerformanceImprovements(metrics: any[]) {
  return metrics
    .filter(m => m.value > 75)
    .map(m => ({
      metric: m.metric_type,
      current_value: m.value,
      suggestion: `Optimize ${m.metric_type} performance`,
      priority: m.value > 90 ? 'high' : 'medium'
    }));
}