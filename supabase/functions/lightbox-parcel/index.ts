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
      console.error('LIGHTBOX_API_KEY is not configured')
      throw new Error('LIGHTBOX_API_KEY is not configured')
    }

    const { address, city, state, zip } = await req.json() as AddressRequest

    if (!address || !city || !state || !zip) {
      console.error('Missing required address fields:', { address, city, state, zip })
      throw new Error('Missing required address fields')
    }

    console.log('Making LightBox API request with:', {
      address,
      city,
      state,
      zip,
      apiKeyPresent: !!LIGHTBOX_API_KEY
    })

    const requestPayload = {
      searchType: "address",
      searchValue: {
        streetAddress: address,
        city: city,
        state: state,
        zip: zip
      }
    }

    try {
      const response = await fetch('https://api-prod.lightboxre.com/api/v2/property/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LIGHTBOX_API_KEY}`,
        },
        body: JSON.stringify(requestPayload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('LightBox API error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`LightBox API returned ${response.status}: ${errorText}`)
      }

      const responseData = await response.json()
      console.log('LightBox API successful response:', responseData)
      
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

    } catch (apiError) {
      console.error('Error making LightBox API request:', apiError)
      throw new Error(`Failed to call LightBox API: ${apiError.message}`)
    }

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