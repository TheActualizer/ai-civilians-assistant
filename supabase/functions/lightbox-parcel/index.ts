import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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
      throw new Error('LightBox API key not configured')
    }

    // Get request body
    const { address, city, state, zip } = await req.json() as AddressRequest
    console.log('Received request for address:', { address, city, state, zip })

    // Make the actual LightBox API call
    const lightboxUrl = 'https://api.lightbox.com/v1/property/search'  // Replace with actual LightBox API endpoint
    const response = await fetch(lightboxUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIGHTBOX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: {
          street: address,
          city: city,
          state: state,
          postalCode: zip
        }
      })
    })

    console.log('LightBox API response status:', response.status)
    const lightboxData = await response.json()
    console.log('LightBox API raw response:', lightboxData)

    // Parse the LightBox response into our expected format
    const parsedResponse = {
      parcelId: lightboxData.parcelId || lightboxData.id,
      address: {
        streetAddress: lightboxData.address?.streetAddress || address,
        city: lightboxData.address?.city || city,
        state: lightboxData.address?.state || state,
        zip: lightboxData.address?.postalCode || zip
      },
      propertyDetails: {
        landUse: lightboxData.propertyType || lightboxData.landUse,
        lotSize: lightboxData.lotSize || lightboxData.parcelSize,
        zoning: lightboxData.zoning || lightboxData.zoningCode,
        yearBuilt: lightboxData.yearBuilt || lightboxData.constructionYear
      },
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

    // Update the property request with LightBox data
    const { error: updateError } = await supabaseClient
      .from('property_requests')
      .update({
        lightbox_data: parsedResponse,
        lightbox_processed_at: new Date().toISOString(),
        status: 'processed',
        status_details: {
          ...parsedResponse,
          lightbox_processed: true,
          processed_at: new Date().toISOString()
        }
      })
      .eq('id', propertyRequest.id)

    if (updateError) {
      console.error('Error updating property request:', updateError)
      throw new Error('Failed to update property request with LightBox data')
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

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