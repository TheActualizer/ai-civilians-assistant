import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Agent, Crew, Task } from 'npm:crewai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { task_type, context } = await req.json()

    // Define our AI agents
    const dbArchitect = new Agent({
      role: 'Database Architect',
      goal: 'Design optimal database schemas and table structures',
      backstory: 'Expert in database design with focus on scalability and data integrity',
      allowDelegation: true,
      verbose: true
    })

    const functionEngineer = new Agent({
      role: 'Function Engineer',
      goal: 'Create efficient and reusable database functions',
      backstory: 'Specialist in PostgreSQL functions and triggers',
      allowDelegation: true,
      verbose: true
    })

    // Create tasks based on request type
    let tasks = []
    if (task_type === 'schema_design') {
      tasks = [
        new Task({
          description: `Analyze the following context and propose optimal table structure: ${context}`,
          agent: dbArchitect
        }),
        new Task({
          description: 'Create necessary database functions and triggers for the proposed schema',
          agent: functionEngineer
        })
      ]
    }

    // Create the crew
    const crew = new Crew({
      agents: [dbArchitect, functionEngineer],
      tasks: tasks,
      verbose: true
    })

    // Execute the crew's tasks
    const result = await crew.execute()

    // Log the execution in our system
    const { error: logError } = await supabase
      .from('system_analysis_intelligence')
      .insert({
        analysis_type: 'database_architecture',
        analysis_layer: 'schema',
        insights: result,
        recommendations: result.recommendations || [],
        created_at: new Date().toISOString()
      })

    if (logError) {
      console.error('Error logging analysis:', logError)
    }

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})