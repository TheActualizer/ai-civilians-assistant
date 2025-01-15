import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface LightBoxRequest {
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
    const { address, city, state, zip } = await req.json() as LightBoxRequest

    console.log('Fetching LightBox data for address:', { address, city, state, zip })

    // Mock API call for now - replace with actual LightBox API endpoint
    const mockResponse = {
      parcelId: "123456789",
      address: {
        streetAddress: address,
        city: city,
        state: state,
        zip: zip
      },
      propertyDetails: {
        landUse: "Residential",
        lotSize: "0.25 acres",
        zoning: "R-1",
        yearBuilt: "1985"
      },
      timestamp: new Date().toISOString(),
      rawResponse: {
        status: "success",
        apiVersion: "1.0",
        metadata: {
          requestId: `lb_${Date.now()}`,
          processedAt: new Date().toISOString()
        }
      }
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
      throw new Error('Failed to fetch property request')
    }

    // Update the property request with LightBox data
    const { error: updateError } = await supabaseClient
      .from('property_requests')
      .update({
        status_details: {
          ...mockResponse,
          lightbox_processed: true,
          processed_at: new Date().toISOString()
        }
      })
      .eq('id', propertyRequest.id)

    if (updateError) {
      throw new Error('Failed to update property request with LightBox data')
    }

    return new Response(
      JSON.stringify(mockResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})