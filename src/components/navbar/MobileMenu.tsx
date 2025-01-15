import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, FilePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MobileMenuProps {
  session: Session | null;
}

export const MobileMenu = ({ session }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate("/login");
      setIsOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem logging out",
      });
    }
  };

  return (
    <>
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="md:hidden p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-2 space-y-1">
              {session && (
                <Link
                  to="/new-report"
                  className="flex items-center space-x-2 px-3 py-2 text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FilePlus className="h-4 w-4" />
                  <span>New Report</span>
                </Link>
              )}
              <Link
                to="/solutions"
                className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Solutions
              </Link>
              <Link
                to="/learn-more"
                className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Learn More
              </Link>
              {session ? (
                <>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Signed in as {session.user.email}
                    </div>
                    <Link
                      to="/"
                      className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders & Reports
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full justify-start px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="w-full justify-center hover:bg-[#E5DEFF] hover:text-[#8B5CF6] transition-colors duration-200"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/get-started");
                      setIsOpen(false);
                    }}
                    className="w-full justify-center bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] hover:from-[#7C3AED] hover:to-[#0284C7] text-white transition-all duration-200"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};