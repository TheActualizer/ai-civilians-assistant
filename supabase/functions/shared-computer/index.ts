import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SharedComputerState {
  activeUsers: string[];
  screenSharing: {
    active: boolean;
    userId?: string;
  };
  voiceChat: {
    active: boolean;
    participants: string[];
  };
  systemLoad: {
    cpu: number;
    memory: number;
    network: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { action, data } = await req.json()
    const timestamp = new Date().toISOString()
    
    // Log the action for monitoring
    console.log(`Shared computer action: ${action}`, {
      timestamp,
      data
    })

    switch (action) {
      case 'join':
        // Handle user joining the shared computer session
        const { user_id, session_id } = data
        await supabase.from('debug_sessions').upsert({
          id: session_id,
          name: 'shared-computer',
          participants: [user_id],
          session_data: {
            lastActive: timestamp,
            state: 'active'
          }
        })
        return new Response(
          JSON.stringify({ success: true, session_id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update_state':
        // Handle state updates (screen sharing, voice chat, etc)
        const { session_id: sid, state } = data
        await supabase.from('debug_sessions').update({
          session_data: {
            ...state,
            lastUpdated: timestamp
          }
        }).eq('id', sid)
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    console.error('Error in shared computer function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})