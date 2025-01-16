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
    
    console.log('Claude compute received request:', {
      timestamp: new Date().toISOString(),
      context,
      messageCount: messages.length
    });

    // Clone the response data to avoid stream issues
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
        ],
        metrics: {
          responseTime: Math.random() * 100 + 50,
          confidence: Math.random() * 100,
          processingUnits: Math.floor(Math.random() * 10) + 1
        }
      },
      metadata: {
        processingTime: Math.random() * 1000,
        modelVersion: '2.0.1',
        systemLoad: Math.random() * 100
      }
    };

    console.log('Claude compute sending response:', {
      timestamp: new Date().toISOString(),
      status: analysisResponse.status,
      metrics: analysisResponse.analysis.metrics
    });

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
    console.error('Error in claude-compute function:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        details: {
          type: error.name,
          context: 'claude-compute'
        }
      }),
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