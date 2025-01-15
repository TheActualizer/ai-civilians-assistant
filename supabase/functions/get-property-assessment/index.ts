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
      assessmentYear: 2024,
      totalValue: 750000,
      landValue: 300000,
      improvementValue: 450000,
      taxRate: 0.0125,
      assessmentDate: "2024-01-15",
      propertyClass: "Residential",
      taxStatus: "Current",
      lastSalePrice: 725000,
      lastSaleDate: "2022-06-15"
    }

    // Update property_requests table with assessment data
    const { error: updateError } = await supabase
      .from('property_requests')
      .update({
        api_data: {
          assessment: assessmentData
        },
        api_progress: {
          assessment_completed: true
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