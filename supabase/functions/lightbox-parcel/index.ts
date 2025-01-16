import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AddressRequest {
  address: string;
  city: string;
  state: string;
  zip: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const LIGHTBOX_API_KEY = Deno.env.get('LIGHTBOX_API_KEY')
    if (!LIGHTBOX_API_KEY) {
      console.error('LightBox API key not configured')
      throw new Error('LightBox API key not configured')
    }

    console.log('Using LightBox API key starting with:', LIGHTBOX_API_KEY.substring(0, 5))

    const { address, city, state, zip } = await req.json() as AddressRequest
    console.log('Received request for address:', { address, city, state, zip })

    if (!address || !city || !state || !zip) {
      console.error('Missing required address components:', { address, city, state, zip })
      throw new Error('Missing required address components')
    }

    try {
      const lightboxUrl = 'https://api-prod.lightboxre.com/api/v2/property/search'
      const requestPayload = {
        address: {
          streetAddress: address,
          city: city,
          state: state,
          postalCode: zip
        }
      }

      console.log('Calling LightBox API with payload:', JSON.stringify(requestPayload))
      
      const lightboxResponse = await fetch(lightboxUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LIGHTBOX_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      })

      // Log the full response for debugging
      const responseText = await lightboxResponse.text()
      console.log('LightBox API raw response:', responseText)

      if (!lightboxResponse.ok) {
        console.error('LightBox API error response:', {
          status: lightboxResponse.status,
          statusText: lightboxResponse.statusText,
          body: responseText
        })
        throw new Error(`LightBox API error: ${lightboxResponse.status} - ${responseText}`)
      }

      let lightboxData
      try {
        lightboxData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Error parsing LightBox response:', parseError)
        throw new Error('Invalid JSON response from LightBox API')
      }

      console.log('LightBox API successful response:', lightboxData)

      // Format the response to match our LightBoxResponse type
      const formattedResponse = {
        parcelId: lightboxData.parcelId || null,
        address: {
          streetAddress: address,
          city: city,
          state: state,
          zip: zip
        },
        propertyDetails: lightboxData.propertyDetails || {},
        rawResponse: lightboxData,
        timestamp: new Date().toISOString(),
        lightbox_processed: true,
        processed_at: new Date().toISOString()
      }

      // Store the response in Supabase
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { data: propertyRequest, error: propertyError } = await supabaseClient
        .from('property_requests')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (propertyError) {
        console.error('Error fetching property request:', propertyError)
        throw new Error('Failed to fetch property request')
      }

      const { error: updateError } = await supabaseClient
        .from('property_requests')
        .update({
          lightbox_data: formattedResponse,
          lightbox_processed_at: new Date().toISOString(),
          status: 'processed'
        })
        .eq('id', propertyRequest.id)

      if (updateError) {
        console.error('Error updating property request:', updateError)
        throw new Error('Failed to update property request with LightBox data')
      }

      return new Response(
        JSON.stringify(formattedResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (apiError) {
      console.error('LightBox API error details:', apiError)
      throw new Error(`Error calling LightBox API: ${apiError.message}`)
    }

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})