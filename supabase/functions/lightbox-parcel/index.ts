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
    
    // Enhanced API key validation with detailed logging
    if (!LIGHTBOX_API_KEY) {
      console.error('LIGHTBOX_API_KEY is not configured in environment')
      throw new Error('LIGHTBOX_API_KEY is not configured')
    }

    if (LIGHTBOX_API_KEY.length < 32) {
      console.error('LIGHTBOX_API_KEY appears to be invalid (too short)')
      throw new Error('Invalid LIGHTBOX_API_KEY format')
    }

    const { address, city, state, zip } = await req.json() as AddressRequest

    // Validate request parameters with detailed logging
    if (!address || !city || !state || !zip) {
      const missingFields = [];
      if (!address) missingFields.push('address');
      if (!city) missingFields.push('city');
      if (!state) missingFields.push('state');
      if (!zip) missingFields.push('zip');
      
      console.error('Missing required address fields:', missingFields);
      throw new Error(`Missing required address fields: ${missingFields.join(', ')}`)
    }

    console.log('Making LightBox API request with:', {
      address,
      city,
      state,
      zip,
      apiKeyPresent: !!LIGHTBOX_API_KEY,
      apiKeyLength: LIGHTBOX_API_KEY.length
    })

    const requestPayload = {
      searchType: "address",
      searchValue: {
        streetAddress: address,
        city: city,
        state: state,
        zip: zip
      }
    }

    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      console.log('Sending request to LightBox API...');
      
      const response = await fetch('https://api-prod.lightboxre.com/api/v2/property/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LIGHTBOX_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('LightBox API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('LightBox API error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });

        // Enhanced error response with more details
        return new Response(
          JSON.stringify({
            error: 'LightBox API request failed',
            details: {
              status: response.status,
              statusText: response.statusText,
              body: errorText,
              requestInfo: {
                url: 'https://api-prod.lightboxre.com/api/v2/property/search',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  // Don't log Authorization header
                }
              }
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status
          }
        );
      }

      const responseData = await response.json();
      console.log('LightBox API successful response received');
      
      const formattedResponse = {
        parcelId: responseData.parcelId || null,
        address: {
          streetAddress: address,
          city: city,
          state: state,
          zip: zip
        },
        propertyDetails: responseData.propertyDetails || {},
        coordinates: responseData.coordinates || { lat: null, lng: null },
        rawResponse: responseData,
        lightbox_processed: true,
        processed_at: new Date().toISOString(),
        status: 'success',
        lightbox_request_id: responseData.requestId || null
      }

      return new Response(
        JSON.stringify(formattedResponse),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )

    } catch (apiError) {
      console.error('Error making LightBox API request:', apiError);
      
      // Check if it's an abort error
      if (apiError.name === 'AbortError') {
        return new Response(
          JSON.stringify({
            error: 'Request timeout',
            details: 'The request to LightBox API timed out after 30 seconds'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 504
          }
        );
      }
      
      throw new Error(`Failed to call LightBox API: ${apiError.message}`);
    }

  } catch (error) {
    console.error('Error in lightbox-parcel function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to process property request',
        details: {
          message: error.message,
          name: error.name,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})