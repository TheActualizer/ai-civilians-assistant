import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GROK_API_KEY = Deno.env.get('GROK_API_KEY');

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
    const { messages, systemPrompt } = await req.json();
    console.log('Received request for Grok compute:', { messages, systemPrompt });

    // Note: This is a placeholder implementation since Grok's API
    // specifications aren't publicly available yet
    const response = await fetch('https://api.x.com/v1/grok/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        messages: messages,
        system: systemPrompt,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Grok API error:', error);
      throw new Error(`Grok API error: ${error}`);
    }

    const data = await response.json();
    console.log('Grok API response:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in grok-compute function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});