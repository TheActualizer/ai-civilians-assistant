import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AI_MODELS = {
  'data-ingestion': 'gemini',
  'parcel-analysis': 'gemini-vision',
  'setback-calculation': 'grok',
  'environmental': 'perplexity',
  'buildable-envelope': 'skyvern',
  'orchestrator': 'claude'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, agentId, context } = await req.json();
    console.log(`Coordinating response for agent ${agentId}:`, { message, context });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Log the interaction start
    const { data: interaction, error: logError } = await supabase
      .from('agent_interactions')
      .insert({
        agent_id: agentId,
        action: 'respond',
        details: { message, context },
        status: 'processing'
      })
      .select()
      .single();

    if (logError) throw logError;

    // Get the appropriate API key based on the model
    const model = AI_MODELS[agentId as keyof typeof AI_MODELS];
    const apiKey = Deno.env.get(`${model.toUpperCase()}_API_KEY`);
    
    if (!apiKey) {
      throw new Error(`API key not found for model: ${model}`);
    }

    // Call the appropriate AI model
    let response;
    switch (model) {
      case 'claude':
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3',
            max_tokens: 1024,
            messages: [{ role: 'user', content: message }],
          }),
        });
        break;
      
      case 'gemini':
      case 'gemini-vision':
        response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
          }),
        });
        break;

      // Add cases for other models...
    }

    if (!response.ok) {
      throw new Error(`AI model response error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    
    // Update interaction status
    await supabase
      .from('agent_interactions')
      .update({
        status: 'completed',
        details: { ...interaction.details, response: aiResponse }
      })
      .eq('id', interaction.id);

    // Format the response based on the agent's role
    const formattedResponse = {
      id: interaction.id,
      agentId,
      message: aiResponse.choices?.[0]?.message?.content || aiResponse.candidates?.[0]?.content?.parts?.[0]?.text,
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(formattedResponse),
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