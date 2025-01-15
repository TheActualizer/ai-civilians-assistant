import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AddressComponents {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GooglePlacesResponse {
  results: {
    address_components: AddressComponents[];
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()
    console.log('Validating address:', address)
    
    // Get Google Maps API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!googleApiKey) {
      throw new Error('Google Maps API key not configured')
    }

    // Call Google Places API
    const encodedAddress = encodeURIComponent(address)
    console.log('Calling Google Places API with encoded address:', encodedAddress)
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`
    )
    
    const data: GooglePlacesResponse = await response.json()
    console.log('Google Places API response status:', data.status)

    if (data.status !== 'OK') {
      throw new Error(`Address validation failed: ${data.status}`)
    }

    const result = data.results[0]
    let streetNumber = ''
    let route = ''
    let city = ''
    let state = ''
    let zipCode = ''

    result.address_components.forEach((component) => {
      if (component.types.includes('street_number')) {
        streetNumber = component.long_name
      }
      if (component.types.includes('route')) {
        route = component.long_name
      }
      if (component.types.includes('locality')) {
        city = component.long_name
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name
      }
      if (component.types.includes('postal_code')) {
        zipCode = component.long_name
      }
    })

    const validatedAddress = {
      street_address: `${streetNumber} ${route}`.trim(),
      city,
      state,
      zip_code: zipCode,
      formatted_address: result.formatted_address,
      coordinates: result.geometry.location
    }

    console.log('Validated address:', validatedAddress)

    return new Response(
      JSON.stringify(validatedAddress),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})