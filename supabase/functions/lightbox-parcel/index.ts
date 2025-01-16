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

    console.log('Validating LightBox API key configuration...')

    const { address, city, state, zip } = await req.json() as AddressRequest
    console.log('Processing request for address:', { address, city, state, zip })

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

    try {
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
            error: `LightBox API error: ${lightboxResponse.status}`,
            details: errorText
          }),
          { 
            status: lightboxResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const responseText = await lightboxResponse.text()
      console.log('Received response from LightBox API')

      let lightboxData
      try {
        lightboxData = JSON.parse(responseText)
        console.log('Successfully parsed LightBox response')
      } catch (parseError) {
        console.error('Failed to parse LightBox response:', parseError)
        return new Response(
          JSON.stringify({ error: 'Invalid JSON response from LightBox API' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

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

    } catch (apiError) {
      console.error('Error calling LightBox API:', apiError)
      return new Response(
        JSON.stringify({ 
          error: 'Error calling LightBox API',
          details: apiError.message 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

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