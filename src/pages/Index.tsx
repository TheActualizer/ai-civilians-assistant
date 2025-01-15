import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import OrderHistory from "@/components/OrderHistory";
import AccountInfo from "@/components/AccountInfo";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [localSession, setLocalSession] = useState<Session | null>(session);

  console.log("🔄 Index page rendering...", { isAuthenticated: !!session });

  const handleLogout = async () => {
    try {
      console.log("🔄 Starting logout process...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setLocalSession(null);
      console.log("✅ Logout successful");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("❌ Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem logging out",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={localSession} setSession={setLocalSession} />
      <div className="pt-24">
        {!session ? (
          <>
            <Hero />
            <Features />
          </>
        ) : (
          <div className="container mx-auto px-4 pb-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {session.user.email}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
            
            <div className="grid gap-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <AccountInfo />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <OrderHistory />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
