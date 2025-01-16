import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { documentUrl } = await req.json();

    if (!documentUrl) {
      throw new Error('Document URL is required');
    }

    console.log('Processing document:', documentUrl);

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // Here we would process the document with OpenAI
    // For now, return a mock response
    const mockAnalysis = {
      summary: "Document analysis complete",
      recommendations: [
        "Property meets zoning requirements",
        "Additional documentation may be needed for permits"
      ],
      confidence: 0.95
    };

    return new Response(
      JSON.stringify(mockAnalysis),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in process-document function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to process document',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});