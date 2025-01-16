import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [authAttempts, setAuthAttempts] = useState(0);

  useEffect(() => {
    console.log('ProtectedRoute: Initializing authentication check...', {
      sessionExists: !!session,
      attemptCount: authAttempts
    });
    
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('ProtectedRoute: Auth error:', error);
          await logAuthEvent('auth_error', { error: error.message });
          throw error;
        }

        console.log('ProtectedRoute: Session verification result:', {
          hasSession: !!currentSession,
          timestamp: new Date().toISOString()
        });

        if (!currentSession) {
          await logAuthEvent('auth_required', { 
            route: window.location.pathname,
            timestamp: new Date().toISOString()
          });
          
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue",
            variant: "destructive",
          });
          navigate('/login');
        } else {
          await logAuthEvent('auth_success', {
            userId: currentSession.user.id,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('ProtectedRoute: Error in auth check:', error);
        setAuthAttempts(prev => prev + 1);
        
        toast({
          title: "Authentication Error",
          description: "There was a problem verifying your session. Retrying...",
          variant: "destructive",
        });
        
        // Retry auth check after delay if under max attempts
        if (authAttempts < 3) {
          setTimeout(checkAuth, 2000);
        } else {
          navigate('/login');
        }
      } finally {
        setIsVerifying(false);
      }
    };

    const logAuthEvent = async (eventType: string, details: any) => {
      try {
        const { error } = await supabase
          .from('debug_logs')
          .insert({
            level: eventType.includes('error') ? 'error' : 'info',
            message: `Auth Event: ${eventType}`,
            context: details,
            source: 'auth_protection'
          });

        if (error) throw error;
      } catch (error) {
        console.error('Failed to log auth event:', error);
      }
    };

    // Initial auth check
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('ProtectedRoute: Auth state changed:', {
        event,
        hasSession: !!session,
        timestamp: new Date().toISOString()
      });
      
      if (event === 'SIGNED_OUT' || !session) {
        await logAuthEvent('signed_out', {
          event,
          timestamp: new Date().toISOString()
        });
        navigate('/login');
      }

      if (event === 'SIGNED_IN') {
        await logAuthEvent('signed_in', {
          userId: session?.user.id,
          timestamp: new Date().toISOString()
        });
      }
    });

    return () => {
      console.log('ProtectedRoute: Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [navigate, toast, session, authAttempts]);

  if (isVerifying) {
    console.log('ProtectedRoute: Verifying authentication...');
    return null;
  }

  if (!session) {
    console.log('ProtectedRoute: No session, rendering null');
    return null;
  }

  console.log('ProtectedRoute: Authentication verified, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;