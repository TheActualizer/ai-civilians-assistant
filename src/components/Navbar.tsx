import { Link } from "react-router-dom";
import { Session } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { TopBar } from "./navbar/TopBar";
import { NavLinks } from "./navbar/NavLinks";
import { ActionButtons } from "./navbar/ActionButtons";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-gradient-to-b from-white via-white to-white/80 border-b border-gray-200 shadow-lg backdrop-blur-md"
    >
      <div className="max-w-[2000px] mx-auto">
        <TopBar />

        <div className="flex justify-between items-center px-4 sm:px-6 h-16 sm:h-20 relative">
          {/* Left section */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link 
              to="/" 
              className="group flex items-center space-x-2"
            >
              <motion.span 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent group-hover:to-[#D946EF] transition-all duration-300"
              >
                AI Civil Engineer
              </motion.span>
            </Link>

            <NavLinks />
          </div>

          {/* Right section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-2 sm:space-x-4"
          >
            <ActionButtons session={session} />
            <UserMenu session={session} />
            <MobileMenu session={session} />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;