import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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
      console.error('LightBox API key not configured')
      throw new Error('LightBox API key not configured')
    }

    const { address, city, state, zip } = await req.json() as AddressRequest
    console.log('Received request for address:', { address, city, state, zip })

    if (!address || !city || !state || !zip) {
      console.error('Missing required address components:', { address, city, state, zip })
      throw new Error('Missing required address components')
    }

    // Call the LightBox API with proper error handling
    try {
      // Updated LightBox API endpoint and request structure
      const lightboxUrl = 'https://api.lightbox.com/api/v2/property/search'
      const requestPayload = {
        searchCriteria: {
          address: {
            streetAddress: address,
            city: city,
            state: state,
            postalCode: zip
          }
        }
      }

      console.log('Calling LightBox API with payload:', requestPayload)
      
      const lightboxResponse = await fetch(lightboxUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LIGHTBOX_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      })

      if (!lightboxResponse.ok) {
        const errorText = await lightboxResponse.text()
        console.error('LightBox API error response:', {
          status: lightboxResponse.status,
          statusText: lightboxResponse.statusText,
          body: errorText
        })
        throw new Error(`LightBox API error: ${lightboxResponse.status} - ${errorText}`)
      }

      const lightboxData = await lightboxResponse.json()
      console.log('LightBox API successful response:', lightboxData)

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
          lightbox_data: lightboxData,
          lightbox_processed_at: new Date().toISOString(),
          status: 'processed'
        })
        .eq('id', propertyRequest.id)

      if (updateError) {
        console.error('Error updating property request:', updateError)
        throw new Error('Failed to update property request with LightBox data')
      }

      return new Response(
        JSON.stringify(lightboxData),
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