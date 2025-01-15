import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Menu, Search, Globe, Bell, HelpCircle, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();

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
              <button className="p-2 text-gray-600 hover:text-primary transition relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-primary transition">
                <User className="h-5 w-5" />
              </button>
            </motion.div>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-primary transition"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/get-started")}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-primary transition">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;