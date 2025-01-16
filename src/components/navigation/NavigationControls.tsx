import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Network, 
  Cpu, 
  BarChart2, 
  Lightbulb,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavigationControlsProps {
  onToggle: () => void;
}

export const NavigationControls = ({ onToggle }: NavigationControlsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/enterprise', icon: Building2, label: 'Enterprise Hub' },
    { path: '/infrastructure', icon: Network, label: 'Infrastructure Hub' },
    { path: '/technology', icon: Cpu, label: 'Technology Hub' },
    { path: '/operations', icon: BarChart2, label: 'Operations Hub' },
    { path: '/innovation', icon: Lightbulb, label: 'Innovation Hub' }
  ];

  return (
    <motion.nav 
      className="h-full bg-gray-900/50 border-r border-gray-700 w-64"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 bg-gray-800 rounded-full"
        onClick={onToggle}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex flex-col gap-2 p-4">
        <TooltipProvider>
          {navigationItems.map(({ path, icon: Icon, label }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <Button
                  variant={location.pathname.startsWith(path) ? "secondary" : "ghost"}
                  className="justify-start w-full"
                  onClick={() => navigate(path)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="truncate">{label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </motion.nav>
  );
};