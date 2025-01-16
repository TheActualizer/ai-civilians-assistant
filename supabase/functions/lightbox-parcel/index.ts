import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AddressRequest {
  address: string;
  city: string;
  state: string;
  zip: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const LIGHTBOX_API_KEY = Deno.env.get('LIGHTBOX_API_KEY')
    if (!LIGHTBOX_API_KEY) {
      throw new Error('LIGHTBOX_API_KEY is not configured')
    }

    const { address, city, state, zip } = await req.json() as AddressRequest

    if (!address || !city || !state || !zip) {
      throw new Error('Missing required address fields')
    }

    const requestPayload = {
      searchType: "address",
      searchValue: {
        streetAddress: address,
        city: city,
        state: state,
        zip: zip
      }
    }

    console.log('Starting LightBox API request with address:', { address, city, state, zip })

    const response = await fetch('https://api-prod.lightboxre.com/api/v2/property/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LIGHTBOX_API_KEY}`,
      },
      body: JSON.stringify(requestPayload),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('LightBox API error:', errorText)
      throw new Error(`LightBox API returned ${response.status}: ${errorText}`)
    }

    const responseData = await response.json()
    
    const formattedResponse = {
      parcelId: responseData.parcelId || null,
      propertyDetails: responseData.propertyDetails || {},
      coordinates: responseData.coordinates || { lat: null, lng: null },
      rawResponse: responseData,
      lightbox_processed: true,
      processed_at: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(formattedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in lightbox-parcel function:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Failed to process property request',
        details: {
          message: error.message,
          name: error.name,
          stack: error.stack
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})