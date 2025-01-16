import { supabase } from "@/integrations/supabase/client";

export interface CrewAIRequest {
  task_type: 'schema_design' | 'function_library';
  context: string;
}

export interface CrewAIResponse {
  result: {
    schema?: any;
    functions?: any;
    recommendations?: string[];
  };
}

export class CrewAIService {
  static async getSchemaRecommendations(context: string): Promise<CrewAIResponse> {
    try {
      console.log('Requesting CrewAI schema analysis:', context);
      
      const { data, error } = await supabase.functions.invoke('crewai-architect', {
        body: {
          task_type: 'schema_design',
          context
        }
      });

      if (error) {
        console.error('CrewAI analysis error:', error);
        throw error;
      }

      console.log('CrewAI analysis result:', data);
      return data;
    } catch (error) {
      console.error('Error in CrewAI service:', error);
      throw error;
    }
  }
}