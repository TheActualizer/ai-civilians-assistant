import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AddressRequest {
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface LightBoxResponse {
  parcelId?: string;
  address?: {
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
  };
  propertyDetails?: {
    landUse?: string;
    lotSize?: string;
    zoning?: string;
    yearBuilt?: string;
  };
  rawResponse?: any;
  timestamp?: string;
  lightbox_processed?: boolean;
  processed_at?: string;
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

    // Attempt to call the actual LightBox API
    try {
      const lightboxUrl = 'https://api.lightbox.com/v1/property/search'
      console.log('Calling LightBox API at:', lightboxUrl)
      console.log('Request payload:', {
        address: {
          street: address,
          city: city,
          state: state,
          zipCode: zip
        }
      })
      
      const lightboxResponse = await fetch(lightboxUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LIGHTBOX_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: {
            street: address,
            city: city,
            state: state,
            zipCode: zip
          }
        })
      })

      if (!lightboxResponse.ok) {
        const errorText = await lightboxResponse.text()
        console.error('LightBox API error:', errorText)
        throw new Error(`LightBox API returned status ${lightboxResponse.status}: ${errorText}`)
      }

      const lightboxData = await lightboxResponse.json()
      console.log('LightBox API response:', lightboxData)

      // Transform the real API response into our expected format
      const response: LightBoxResponse = {
        parcelId: lightboxData.parcelId || `LB${Date.now()}`,
        address: {
          streetAddress: address,
          city: city,
          state: state,
          zip: zip
        },
        propertyDetails: {
          landUse: lightboxData.landUse || "Unknown",
          lotSize: lightboxData.lotSize || "Unknown",
          zoning: lightboxData.zoning || "Unknown",
          yearBuilt: lightboxData.yearBuilt || "Unknown"
        },
        timestamp: new Date().toISOString(),
        lightbox_processed: true,
        processed_at: new Date().toISOString(),
        rawResponse: lightboxData
      }

      console.log('Transformed response:', response)

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
          lightbox_data: response,
          lightbox_processed_at: new Date().toISOString(),
          status: 'processed',
          status_details: {
            ...response
          }
        })
        .eq('id', propertyRequest.id)

      if (updateError) {
        console.error('Error updating property request:', updateError)
        throw new Error('Failed to update property request with LightBox data')
      }

      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (apiError) {
      console.error('Error calling LightBox API:', apiError)
      throw new Error(`Error calling LightBox API: ${apiError.message}`)
    }

  } catch (error) {
    console.error('Error in lightbox-parcel function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})