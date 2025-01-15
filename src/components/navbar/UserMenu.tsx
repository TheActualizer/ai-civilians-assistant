import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Settings,
  FileText,
  LogOut,
  ChevronDown,
  FilePlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserMenuProps {
  session: Session | null;
}

export const UserMenu = ({ session }: UserMenuProps) => {
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
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem logging out",
      });
    }
  };

  if (!session) {
    return (
      <div className="hidden md:flex items-center space-x-4">
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
      </div>
    );
  }

  return (
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
  );
};