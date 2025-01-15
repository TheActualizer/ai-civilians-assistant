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
  LogOut,
  FilePlus
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
      className="fixed w-full z-50 bg-gradient-to-b from-white via-white to-white/80 border-b border-gray-200 shadow-lg backdrop-blur-md"
    >
      <div className="max-w-[2000px] mx-auto">
        {/* Top bar with secondary navigation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-[#1A1F2C] to-[#403E43] text-white py-2 px-4 border-b border-gray-700/20"
        >
          <div className="flex justify-between items-center text-sm">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-4"
            >
              <Globe className="h-4 w-4 text-[#D3E4FD]" />
              <span className="text-[#D3E4FD]">United States (EN)</span>
            </motion.div>
            <div className="flex items-center space-x-6">
              <Link 
                to="/solutions" 
                className="hover:text-[#0EA5E9] transition-colors duration-200 border-b-2 border-transparent hover:border-[#0EA5E9]"
              >
                Solutions
              </Link>
              <Link 
                to="/learn-more" 
                className="hover:text-[#0EA5E9] transition-colors duration-200 border-b-2 border-transparent hover:border-[#0EA5E9]"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main navigation */}
        <div className="flex justify-between items-center px-6 h-20 relative">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="group flex items-center space-x-2"
            >
              <motion.span 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent group-hover:to-[#D946EF] transition-all duration-300"
              >
                AI Civil Engineer
              </motion.span>
            </Link>

            {/* Main navigation items */}
            <div className="hidden md:flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 animate-in slide-in-from-top-1 duration-200">
                  <DropdownMenuItem className="hover:bg-[#E5DEFF] cursor-pointer">
                    Zoning Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#E5DEFF] cursor-pointer">
                    Building Codes
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#E5DEFF] cursor-pointer">
                    Environmental Reports
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/learn-more"
                className="px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <div className="hidden md:flex items-center space-x-4">
              {session && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/new-report")}
                  className="flex items-center space-x-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all duration-200"
                >
                  <FilePlus className="h-4 w-4" />
                  <span>New Report</span>
                </Button>
              )}
              <button className="p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200 rounded-full hover:bg-gray-50">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200 rounded-full hover:bg-gray-50">
                <HelpCircle className="h-5 w-5" />
              </button>
              {session && (
                <button className="p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200 rounded-full hover:bg-gray-50 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative flex items-center space-x-2 hover:bg-[#E5DEFF] hover:text-[#8B5CF6] transition-all duration-200"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline-block">
                        {session.user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem 
                      onClick={() => navigate("/")}
                      className="hover:bg-[#E5DEFF] cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/orders")}
                      className="hover:bg-[#E5DEFF] cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Orders & Reports
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/settings")}
                      className="hover:bg-[#E5DEFF] cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
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
                    className="text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] transition-all duration-200"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate("/get-started")}
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] hover:from-[#7C3AED] hover:to-[#0284C7] text-white transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="px-4 py-2 space-y-1">
                {session && (
                  <Link
                    to="/new-report"
                    className="flex items-center space-x-2 px-3 py-2 text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FilePlus className="h-4 w-4" />
                    <span>New Report</span>
                  </Link>
                )}
                <Link
                  to="/solutions"
                  className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Solutions
                </Link>
                <Link
                  to="/learn-more"
                  className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
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
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Orders & Reports
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-3 py-2 text-gray-700 hover:text-[#8B5CF6] hover:bg-[#E5DEFF] rounded-md transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
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
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-center hover:bg-[#E5DEFF] hover:text-[#8B5CF6] transition-colors duration-200"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        navigate("/get-started");
                        setIsMobileMenuOpen(false);
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
      </div>
    </motion.nav>
  );
};

export default Navbar;