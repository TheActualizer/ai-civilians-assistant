import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { InteractionLog } from '@/types/interaction';

export function useInteractionLogging() {
  const { toast } = useToast();

  const logInteraction = useCallback(async (
    interaction_type: string,
    component_name: string,
    details: Record<string, any> = {},
    performance_metrics: Record<string, any> = {}
  ) => {
    try {
      console.log(`Logging interaction: ${interaction_type} in ${component_name}`);
      
      const { data: profile } = await supabase.auth.getUser();
      
      if (!profile.user?.id) {
        console.warn('No authenticated user found for interaction logging');
        return;
      }

      const interactionData: Partial<InteractionLog> = {
        profile_id: profile.user.id,
        interaction_type,
        component_name,
        details,
        performance_metrics,
        session_id: crypto.randomUUID(),
        client_info: {
          browser: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      };

      const { error } = await supabase
        .from('interaction_logs')
        .insert(interactionData);

      if (error) {
        throw error;
      }

      console.log('Interaction logged successfully:', interactionData);
    } catch (error) {
      console.error('Error logging interaction:', error);
      toast({
        variant: "destructive",
        title: "Error logging interaction",
        description: "The interaction could not be logged. Please try again."
      });
    }
  }, [toast]);

  return { logInteraction };
}