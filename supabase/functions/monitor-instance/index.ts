import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get current system metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('system_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()

    if (metricsError) {
      throw metricsError
    }

    // Get active shared computer sessions
    const { data: activeSessions, error: sessionsError } = await supabase
      .from('shared_computer_sessions')
      .select('*')
      .eq('screen_sharing->active', true)

    if (sessionsError) {
      throw sessionsError
    }

    const performanceMetrics = {
      cpu_usage: metrics?.value || 0,
      active_screen_sharing: activeSessions?.length || 0,
      timestamp: new Date().toISOString(),
      instance_type: 'mini',
      cost_per_day: 0.25,
      recommendation: metrics?.value > 70 ? 'Consider upgrading instance' : 'Current instance is sufficient'
    }

    // Log performance data
    const { error: logError } = await supabase
      .from('system_metrics')
      .insert([{
        metric_type: 'instance_performance',
        value: performanceMetrics.cpu_usage,
        component: 'server',
        metadata: performanceMetrics
      }])

    if (logError) {
      throw logError
    }

    return new Response(
      JSON.stringify(performanceMetrics),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})