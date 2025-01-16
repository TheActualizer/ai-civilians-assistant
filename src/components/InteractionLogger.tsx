import { useEffect } from 'react';
import { useInteractionLogging } from '@/hooks/useInteractionLogging';

interface InteractionLoggerProps {
  componentName: string;
  children: React.ReactNode;
}

export function InteractionLogger({ componentName, children }: InteractionLoggerProps) {
  const { logInteraction } = useInteractionLogging();

  useEffect(() => {
    const startTime = performance.now();
    
    logInteraction('mount', componentName, {}, {
      mount_timestamp: new Date().toISOString()
    });

    return () => {
      const duration = performance.now() - startTime;
      logInteraction('unmount', componentName, {}, {
        duration_ms: duration,
        unmount_timestamp: new Date().toISOString()
      });
    };
  }, [componentName, logInteraction]);

  const handleInteraction = (event: React.SyntheticEvent) => {
    logInteraction('user_interaction', componentName, {
      event_type: event.type,
      target: (event.target as HTMLElement).tagName,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div 
      onClick={handleInteraction}
      onKeyPress={handleInteraction}
      className="interaction-wrapper"
    >
      {children}
    </div>
  );
}