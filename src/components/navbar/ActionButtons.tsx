import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle, Bell, FilePlus } from "lucide-react";

interface ActionButtonsProps {
  session: Session | null;
}

export const ActionButtons = ({ session }: ActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
      {session && (
        <Button
          variant="outline"
          onClick={() => navigate("/new-report")}
          className="hidden sm:flex items-center space-x-1 text-sm border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all duration-200"
        >
          <FilePlus className="h-4 w-4" />
          <span>New Report</span>
        </Button>
      )}
      <button className="p-1.5 sm:p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200 rounded-full hover:bg-gray-50">
        <Search className="h-4 w-4" />
      </button>
      <button className="p-1.5 sm:p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200 rounded-full hover:bg-gray-50">
        <HelpCircle className="h-4 w-4" />
      </button>
      {session && (
        <button className="p-1.5 sm:p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200 rounded-full hover:bg-gray-50 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}
    </div>
  );
};