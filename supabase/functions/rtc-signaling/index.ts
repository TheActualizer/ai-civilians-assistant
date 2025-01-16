import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { sessionId, signal } = await req.json()

    if (!sessionId || !signal) {
      throw new Error('Missing required fields')
    }

    console.log(`📡 Processing signal for session ${sessionId}`)

    // Store the signaling data in the session
    const { error: updateError } = await supabase
      .from('communication_sessions')
      .update({
        session_data: {
          lastSignal: signal,
          timestamp: new Date().toISOString()
        }
      })
      .eq('id', sessionId)

    if (updateError) throw updateError

    // Get the updated session
    const { data: session, error: fetchError } = await supabase
      .from('communication_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (fetchError) throw fetchError

    console.log(`📡 Signal processed for session ${sessionId}`)

    return new Response(
      JSON.stringify({ success: true, session }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in rtc-signaling function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})