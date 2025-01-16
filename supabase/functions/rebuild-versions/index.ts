import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RebuildRequest {
  version_ids: string[];
  rebuild_type: string;
  rebuild_config?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { version_ids, rebuild_type, rebuild_config = {} } = await req.json() as RebuildRequest

    console.log('Starting rebuild process for versions:', version_ids)

    // Create rebuild operation record
    const { data: operation, error: insertError } = await supabaseClient
      .from('rebuild_operations')
      .insert({
        version_ids,
        rebuild_type,
        rebuild_config,
        rebuild_metrics: {
          start_time: new Date().toISOString(),
          components_processed: 0
        },
        status: 'processing'
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Fetch version details
    const { data: versions, error: versionsError } = await supabaseClient
      .from('ui_versions')
      .select('*')
      .in('id', version_ids)

    if (versionsError) throw versionsError

    console.log('Processing versions:', versions)

    // Process each version
    for (const version of versions) {
      try {
        // Update component registry
        const updatedRegistry = await processComponentRegistry(version.component_registry)
        
        // Update integration points
        const updatedIntegrations = await processIntegrationPoints(version.integration_points)

        // Update the version with processed data
        const { error: updateError } = await supabaseClient
          .from('ui_versions')
          .update({
            component_registry: updatedRegistry,
            integration_points: updatedIntegrations,
            metadata: {
              ...version.metadata,
              last_rebuild: new Date().toISOString(),
              rebuild_type
            }
          })
          .eq('id', version.id)

        if (updateError) throw updateError

        // Update rebuild metrics
        await supabaseClient
          .from('rebuild_operations')
          .update({
            rebuild_metrics: {
              ...operation.rebuild_metrics,
              components_processed: operation.rebuild_metrics.components_processed + 1
            }
          })
          .eq('id', operation.id)

      } catch (error) {
        console.error(`Error processing version ${version.id}:`, error)
        throw error
      }
    }

    // Mark operation as completed
    const { error: finalizeError } = await supabaseClient
      .from('rebuild_operations')
      .update({
        status: 'completed',
        rebuild_metrics: {
          ...operation.rebuild_metrics,
          success_rate: 100
        }
      })
      .eq('id', operation.id)

    if (finalizeError) throw finalizeError

    return new Response(
      JSON.stringify({ success: true, operation_id: operation.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Rebuild error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Helper function to process component registry
async function processComponentRegistry(registry: Record<string, any>) {
  // Add processing logic here
  return registry
}

// Helper function to process integration points
async function processIntegrationPoints(points: string[]) {
  // Add processing logic here
  return points
}