import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface UnityGameState {
  sessionId: string;
  gameState: Record<string, any>;
  metrics: {
    active_agents: number;
    active_flows: number;
    performance: number;
  };
  playerData: Record<string, any>;
}

export function useUnityState(sessionId?: string) {
  const [gameState, setGameState] = useState<UnityGameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    console.log('Initializing Unity state hook for session:', sessionId);
    
    const fetchInitialState = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('unity_game_state')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (fetchError) throw fetchError;
        
        if (data) {
          console.log('Initial Unity state loaded:', data);
          setGameState(data as UnityGameState);
        }
      } catch (err) {
        console.error('Error fetching Unity state:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialState();

    // Subscribe to real-time updates
    const channel = supabase.channel(`unity_state_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'unity_game_state',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Unity state update:', payload);
          if (payload.new) {
            setGameState(payload.new as UnityGameState);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Unity state subscription');
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return { gameState, loading, error };
}