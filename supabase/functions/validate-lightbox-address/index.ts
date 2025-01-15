import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const LIGHTBOX_API_BASE = 'https://api.lightboxre.com/v1'

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
    const { address } = await req.json()
    console.log('Validating address:', address)

    const apiKey = Deno.env.get('LIGHTBOX_API_KEY')
    if (!apiKey) {
      throw new Error('LIGHTBOX_API_KEY not configured')
    }

    // Call LightBox Geocoding API
    const geocodeResponse = await fetch(`${LIGHTBOX_API_BASE}/addresses/search?text=${encodeURIComponent(address)}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!geocodeResponse.ok) {
      throw new Error(`LightBox API error: ${geocodeResponse.statusText}`)
    }

    const geocodeData = await geocodeResponse.json()
    console.log('LightBox API response:', geocodeData)

    return new Response(
      JSON.stringify(geocodeData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})