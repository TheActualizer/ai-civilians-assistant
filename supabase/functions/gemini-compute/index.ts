import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@^0.1.3"

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
    const { messages, systemPrompt, multimodal = false } = await req.json()
    
    console.log('Gemini compute request:', { messages, systemPrompt, multimodal })

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!)
    
    // Select model based on requirements
    const model = multimodal ? 
      genAI.getGenerativeModel({ model: "gemini-pro-vision" }) :
      genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare chat
    const chat = model.startChat({
      history: messages.map((msg: any) => ({
        role: msg.role,
        parts: msg.content,
      })),
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Generate response
    const result = await chat.sendMessage(systemPrompt || "You are a helpful AI assistant");
    const response = await result.response;
    const text = response.text();

    console.log('Gemini compute response:', text);

    return new Response(
      JSON.stringify({ content: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in gemini-compute:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})