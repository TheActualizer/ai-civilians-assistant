import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Menu, 
  Search, 
  Globe, 
  Bell, 
  HelpCircle, 
  User, 
  X,
  Settings,
  FileText,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate("/login");
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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/90"
    >
      <div className="max-w-[2000px] mx-auto">
        {/* Top bar with secondary navigation */}
        <div className="bg-gray-900 text-white py-1 px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <Globe className="h-4 w-4" />
              <span>United States (EN)</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/docs" className="hover:text-blue-300 transition">Documentation</Link>
              <Link to="/support" className="hover:text-blue-300 transition">Support</Link>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex justify-between items-center px-4 h-16">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
              >
                AI Civil Engineer
              </motion.span>
            </Link>

            {/* Main navigation items */}
            <div className="hidden md:flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-3 py-2 text-gray-700 hover:text-primary transition">
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Zoning Analysis</DropdownMenuItem>
                  <DropdownMenuItem>Building Codes</DropdownMenuItem>
                  <DropdownMenuItem>Environmental Reports</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/learn-more"
                className="px-3 py-2 text-gray-700 hover:text-primary transition"
              >
                Learn More
              </Link>

              <Link
                to="/pricing"
                className="px-3 py-2 text-gray-700 hover:text-primary transition"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex items-center space-x-4"
            >
              <button className="p-2 text-gray-600 hover:text-primary transition">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-primary transition">
                <HelpCircle className="h-5 w-5" />
              </button>
              {session && (
                <button className="p-2 text-gray-600 hover:text-primary transition relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              )}
            </motion.div>

            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative flex items-center space-x-2"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline-block">
                        {session.user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate("/")}>
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Orders & Reports
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/login")}
                    className="text-gray-700 hover:text-primary transition"
                  >
                    Login
                  </Button>
                  <Button onClick={() => navigate("/get-started")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-primary transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-2 space-y-1">
                <Link
                  to="/solutions"
                  className="block px-3 py-2 text-gray-700 hover:text-primary transition"
                >
                  Solutions
                </Link>
                <Link
                  to="/learn-more"
                  className="block px-3 py-2 text-gray-700 hover:text-primary transition"
                >
                  Learn More
                </Link>
                <Link
                  to="/pricing"
                  className="block px-3 py-2 text-gray-700 hover:text-primary transition"
                >
                  Pricing
                </Link>
                {session ? (
                  <>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Signed in as {session.user.email}
                      </div>
                      <Link
                        to="/"
                        className="block px-3 py-2 text-gray-700 hover:text-primary transition"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-3 py-2 text-gray-700 hover:text-primary transition"
                      >
                        Orders & Reports
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-3 py-2 text-gray-700 hover:text-primary transition"
                      >
                        Settings
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start px-3 py-2 text-red-600 hover:text-red-700 transition"
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
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-center"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        navigate("/get-started");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-center"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;