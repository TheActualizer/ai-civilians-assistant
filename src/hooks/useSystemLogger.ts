import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LogContext {
  component?: string;
  route?: string;
  metrics?: {
    executionTime?: number;
    memoryUsage?: number;
    apiLatency?: number;
  };
  trace?: string[];
}

interface SystemLogParams {
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  context?: LogContext;
  metadata?: Record<string, any>;
}

export function useSystemLogger() {
  const { toast } = useToast();

  const logSystemEvent = useCallback(async ({
    level,
    message,
    context = {},
    metadata = {}
  }: SystemLogParams) => {
    try {
      console.log(`🔍 [${level.toUpperCase()}] ${message}`, { context, metadata });

      const { data, error } = await supabase.functions.invoke('system-logging-analysis', {
        body: {
          log: {
            source: 'frontend',
            level,
            message,
            context: {
              ...context,
              timestamp: new Date().toISOString(),
              route: window.location.pathname,
            },
            metadata: {
              ...metadata,
              userAgent: navigator.userAgent,
              screenSize: {
                width: window.innerWidth,
                height: window.innerHeight
              }
            }
          },
          analysis_type: level === 'error' ? 'deep' : 'standard'
        }
      });

      if (error) throw error;

      if (level === 'error') {
        toast({
          variant: "destructive",
          title: "System Error Logged",
          description: "The error has been recorded and will be analyzed.",
        });
      }

      return data;
    } catch (error) {
      console.error('Error logging system event:', error);
      toast({
        variant: "destructive",
        title: "Logging Error",
        description: "Failed to log system event.",
      });
    }
  }, [toast]);

  return { logSystemEvent };
}