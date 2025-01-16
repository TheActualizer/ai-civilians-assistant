import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const skyvernApiKey = Deno.env.get('SKYVERN_API_KEY');

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
    console.log('Calling Skyvern API with:', { messages, systemPrompt });

    const response = await fetch('https://api.skyvern.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${skyvernApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'skyvern-1',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Skyvern API error:', error);
      throw new Error(`Skyvern API error: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Skyvern API response:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in skyvern-compute function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});