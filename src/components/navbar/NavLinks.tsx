import { Link } from "react-router-dom";
import { ChevronDown, Brain } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavLinks = () => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <Link
        to="/ai-civil-engineer"
        className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-primary text-sm font-semibold hover:text-primary/90 transition-colors duration-200 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
      >
        <Brain className="mr-1.5 h-4 w-4" />
        AI Civil Engineer
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          Solutions
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 animate-in slide-in-from-top-1 duration-200">
          <DropdownMenuItem className="hover:bg-[#E5DEFF] cursor-pointer">
            <Link to="/new-report" className="w-full flex items-center">
              New Report
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-[#E5DEFF] cursor-pointer">
            <Link to="/solutions" className="w-full">
              All Solutions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-[#E5DEFF] cursor-pointer">
            <Link to="/address-validation" className="w-full">
              Address Validation
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        to="/calculations"
        className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
      >
        Calculations
      </Link>

      <Link
        to="/learn-more"
        className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
      >
        Learn More
      </Link>
    </div>
  );
};