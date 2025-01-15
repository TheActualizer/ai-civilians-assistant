import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavLinks = () => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          Solutions
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 animate-in slide-in-from-top-1 duration-200">
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
        to="/calculations"
        className="px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
      >
        Calculations
      </Link>

      <Link
        to="/learn-more"
        className="px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
      >
        Learn More
      </Link>
    </div>
  );
};