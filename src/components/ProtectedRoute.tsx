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

  useEffect(() => {
    console.log('ProtectedRoute: Checking authentication status...');
    
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('ProtectedRoute: Auth error:', error);
          throw error;
        }

        console.log('ProtectedRoute: Session status:', currentSession ? 'Active' : 'None');

        if (!currentSession) {
          toast({
            title: "Authentication required",
            description: "Please log in to access this page",
            variant: "destructive",
          });
          navigate('/login');
        }
      } catch (error) {
        console.error('ProtectedRoute: Error checking auth:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem verifying your session",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsVerifying(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('ProtectedRoute: Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log('ProtectedRoute: User signed out or session expired');
        navigate('/login');
      }
    });

    return () => {
      console.log('ProtectedRoute: Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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