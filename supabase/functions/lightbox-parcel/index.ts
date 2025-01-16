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
      return new Response(
        JSON.stringify({ error: 'LightBox API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Starting LightBox API request processing...')

    const { address, city, state, zip } = await req.json() as AddressRequest
    console.log('Received address data:', { address, city, state, zip })

    if (!address || !city || !state || !zip) {
      console.error('Missing required address components')
      return new Response(
        JSON.stringify({ error: 'Missing required address components' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const lightboxUrl = 'https://api-prod.lightboxre.com/api/v2/property/search'
    const requestPayload = {
      address: {
        streetAddress: address,
        city: city,
        state: state,
        postalCode: zip
      }
    }

    console.log('Sending request to LightBox API:', JSON.stringify(requestPayload))

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
      console.error('LightBox API error:', {
        status: lightboxResponse.status,
        statusText: lightboxResponse.statusText,
        error: errorText
      })
      
      return new Response(
        JSON.stringify({ 
          error: 'LightBox API error',
          details: `${lightboxResponse.status}: ${errorText}`
        }),
        { 
          status: lightboxResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const responseData = await lightboxResponse.json()
    console.log('Successfully received LightBox API response')

    const formattedResponse = {
      parcelId: responseData.parcelId || null,
      address: {
        streetAddress: address,
        city: city,
        state: state,
        zip: zip
      },
      propertyDetails: responseData.propertyDetails || {},
      rawResponse: responseData,
      lightbox_processed: true,
      processed_at: new Date().toISOString(),
      api_progress: {
        parcel_completed: true,
        zoning_completed: false,
        geocoding_completed: false,
        assessment_completed: false,
        structures_completed: false,
        transactions_completed: false,
        historical_tax_completed: false,
        historical_assessment_completed: false
      }
    }

    console.log('Storing response in Supabase...')

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
      console.error('Failed to fetch property request:', propertyError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch property request' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
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
      console.error('Failed to update property request:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update property request' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Successfully processed and stored LightBox data')

    return new Response(
      JSON.stringify(formattedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})