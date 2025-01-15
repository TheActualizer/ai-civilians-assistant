import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  session: Session | null;
}

const ProtectedRoute = ({ children, session }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [session, navigate, toast]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;