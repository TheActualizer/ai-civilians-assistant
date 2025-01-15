import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export const TopBar = () => {
  return (
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
  );
};