import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { messages, systemPrompt, context } = await req.json();
    
    console.log('Received analysis request:', {
      messages,
      systemPrompt,
      context
    });

    // For now, return a mock analysis response
    const analysisResponse = {
      status: 'completed',
      timestamp: new Date().toISOString(),
      analysis: {
        systemState: {
          route: context.pageRoute,
          phase: context.evolutionPhase,
          health: context.systemHealth
        },
        insights: [
          'System initialization successful',
          'Connection established',
          'Ready for further directives'
        ],
        recommendations: [
          'Continue monitoring system health',
          'Establish additional agent connections',
          'Prepare for next evolution phase'
        ]
      }
    };

    console.log('Sending analysis response:', analysisResponse);

    return new Response(
      JSON.stringify(analysisResponse),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in claude-compute function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});