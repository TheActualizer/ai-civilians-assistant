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
      return new Response(
        JSON.stringify({ error: 'LightBox API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const { address, city, state, zip } = await req.json() as AddressRequest
    console.log('Processing address:', { address, city, state, zip })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the latest property request
    const { data: propertyRequest, error: fetchError } = await supabaseClient
      .from('property_requests')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError) {
      console.error('Failed to fetch property request:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch property request' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Log the start of API call
    await supabaseClient.rpc('log_api_execution', {
      request_id: propertyRequest.id,
      endpoint: 'property_search',
      status: 'started',
      message: 'Initiating LightBox property search API call',
      details: { address, city, state, zip }
    })

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

    if (!lightboxResponse.ok) {
      const errorText = await lightboxResponse.text()
      console.error('LightBox API error:', {
        status: lightboxResponse.status,
        statusText: lightboxResponse.statusText,
        error: errorText
      })

      // Log the API error
      await supabaseClient.rpc('log_api_execution', {
        request_id: propertyRequest.id,
        endpoint: 'property_search',
        status: 'error',
        message: `API error: ${lightboxResponse.status} ${lightboxResponse.statusText}`,
        details: { error: errorText }
      })

      return new Response(
        JSON.stringify({ 
          error: 'LightBox API error',
          details: `${lightboxResponse.status}: ${errorText}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: lightboxResponse.status }
      )
    }

    const responseData = await lightboxResponse.json()
    console.log('LightBox API response received:', JSON.stringify(responseData))

    // Format the response
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

    // Update property request with results
    const { error: updateError } = await supabaseClient
      .from('property_requests')
      .update({
        lightbox_data: formattedResponse,
        lightbox_processed_at: new Date().toISOString(),
        status: 'processed',
        lightbox_raw_responses: {
          property_search: responseData
        },
        lightbox_endpoints: {
          property_search: {
            status: 'completed',
            last_updated: new Date().toISOString(),
            error: null
          }
        }
      })
      .eq('id', propertyRequest.id)

    if (updateError) {
      console.error('Failed to update property request:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update property request' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Log successful API call
    await supabaseClient.rpc('log_api_execution', {
      request_id: propertyRequest.id,
      endpoint: 'property_search',
      status: 'completed',
      message: 'Successfully retrieved property data',
      details: formattedResponse
    })

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})