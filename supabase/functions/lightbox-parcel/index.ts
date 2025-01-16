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
  // Handle CORS preflight requests
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

    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const lightboxResponse = await fetch(lightboxUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LIGHTBOX_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      })

      clearTimeout(timeoutId);

      console.log('LightBox API response status:', lightboxResponse.status)
      console.log('LightBox API response headers:', Object.fromEntries(lightboxResponse.headers.entries()))
      
      const responseText = await lightboxResponse.text()
      console.log('Raw LightBox API response:', responseText)

      if (!lightboxResponse.ok) {
        const errorDetails = {
          status: lightboxResponse.status,
          statusText: lightboxResponse.statusText,
          response: responseText,
          headers: Object.fromEntries(lightboxResponse.headers.entries())
        }
        console.error('LightBox API error details:', errorDetails)

        // Log the API error
        await supabaseClient.rpc('log_api_execution', {
          request_id: propertyRequest.id,
          endpoint: 'property_search',
          status: 'error',
          message: `API error: ${lightboxResponse.status} ${lightboxResponse.statusText}`,
          details: errorDetails
        })

        // Update property request with error status
        await supabaseClient
          .from('property_requests')
          .update({
            'lightbox_endpoints': {
              'property_search': {
                status: 'error',
                last_updated: new Date().toISOString(),
                error: `${lightboxResponse.status}: ${responseText}`
              }
            }
          })
          .eq('id', propertyRequest.id)

        return new Response(
          JSON.stringify({ 
            error: 'LightBox API error',
            details: errorDetails
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: lightboxResponse.status }
        )
      }

      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse LightBox API response:', parseError)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid JSON response from LightBox API',
            details: responseText
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Format the response
      const formattedResponse = {
        parcelId: responseData.parcelId || null,
        address: {
          streetAddress: address,
          city: city,
          state: state,
          zip: zip,
          county: responseData.county || null
        },
        propertyDetails: responseData.propertyDetails || {},
        coordinates: responseData.coordinates || null,
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

    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      
      // Log the fetch error with more details
      const errorDetails = {
        message: fetchError.message,
        name: fetchError.name,
        stack: fetchError.stack,
        cause: fetchError.cause
      }
      
      // Log the fetch error
      await supabaseClient.rpc('log_api_execution', {
        request_id: propertyRequest.id,
        endpoint: 'property_search',
        status: 'error',
        message: 'Network error when calling LightBox API',
        details: errorDetails
      })

      // Update property request with error status
      await supabaseClient
        .from('property_requests')
        .update({
          'lightbox_endpoints': {
            'property_search': {
              status: 'error',
              last_updated: new Date().toISOString(),
              error: fetchError.message
            }
          }
        })
        .eq('id', propertyRequest.id)

      return new Response(
        JSON.stringify({ 
          error: 'Failed to call LightBox API',
          details: errorDetails
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: {
          message: error.message,
          name: error.name,
          stack: error.stack
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})