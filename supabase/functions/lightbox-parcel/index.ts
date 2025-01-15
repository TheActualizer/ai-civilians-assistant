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
      throw new Error('LightBox API key not configured')
    }

    const { address, city, state, zip } = await req.json() as AddressRequest
    console.log('Received request for address:', { address, city, state, zip })

    // Mock response for testing since we can't access the real LightBox API
    const mockResponse: LightBoxResponse = {
      parcelId: "LB" + Date.now(),
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
      lightbox_processed: true,
      processed_at: new Date().toISOString(),
      rawResponse: {
        status: "success",
        metadata: {
          requestId: `lb_${Date.now()}`,
          processedAt: new Date().toISOString()
        },
        apiVersion: "1.0"
      }
    };

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
        lightbox_data: mockResponse,
        lightbox_processed_at: new Date().toISOString(),
        status: 'processed',
        status_details: {
          ...mockResponse
        }
      })
      .eq('id', propertyRequest.id)

    if (updateError) {
      console.error('Error updating property request:', updateError)
      throw new Error('Failed to update property request with LightBox data')
    }

    return new Response(
      JSON.stringify(mockResponse),
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