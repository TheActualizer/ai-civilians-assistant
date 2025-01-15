import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { propertyId } = await req.json()
    console.log('Fetching assessment data for property:', propertyId)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Mock assessment data for now - replace with actual API call
    const assessmentData = {
      assessmentYear: new Date().getFullYear(),
      totalValue: 450000,
      landValue: 150000,
      improvementValue: 300000,
      taxRate: 0.0125,
      assessmentDate: new Date().toISOString().split('T')[0],
      propertyClass: "Single Family Residential",
      taxStatus: "Current",
      lastSalePrice: 425000,
      lastSaleDate: "2023-06-15"
    }

    // Update property_requests table with assessment data
    const { error: updateError } = await supabase
      .from('property_requests')
      .update({
        api_data: {
          parcel: null,
          zoning: null,
          geocoding: null,
          assessment: assessmentData,
          structures: null,
          transactions: null,
          historical_tax: null,
          historical_assessment: null
        },
        api_progress: {
          parcel_completed: false,
          zoning_completed: false,
          geocoding_completed: false,
          assessment_completed: true,
          structures_completed: false,
          transactions_completed: false,
          historical_tax_completed: false,
          historical_assessment_completed: false
        }
      })
      .eq('id', propertyId)

    if (updateError) {
      console.error('Error updating property request:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: assessmentData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in get-property-assessment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})