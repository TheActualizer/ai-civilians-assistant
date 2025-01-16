import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, agentId, context } = await req.json();
    console.log(`Coordinating response for agent ${agentId}:`, { message, context });

    // Log the interaction in the database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: interaction, error } = await supabase
      .from('agent_interactions')
      .insert({
        agent_id: agentId,
        action: 'respond',
        details: { message, context },
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;

    // For now, return a simulated response
    // In a real implementation, this would use the appropriate AI model for each agent
    const response = {
      id: interaction.id,
      agentId,
      message: `Processed ${agentId}'s response to: ${message}`,
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in coordinate-agents function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});