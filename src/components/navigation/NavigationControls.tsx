import { useNavigate, useLocation } from 'react-router-dom';
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

export const NavigationControls = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const navigationItems = [
    { path: '/enterprise', icon: Building2, label: 'Enterprise Hub' },
    { path: '/infrastructure', icon: Network, label: 'Infrastructure Hub' },
    { path: '/technology', icon: Cpu, label: 'Technology Hub' },
    { path: '/operations', icon: BarChart2, label: 'Operations Hub' },
    { path: '/innovation', icon: Lightbulb, label: 'Innovation Hub' }
  ];

  return (
    <nav className={`fixed left-0 top-20 h-full bg-gray-900/50 border-r border-gray-700 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 bg-gray-800 rounded-full"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      <div className="flex flex-col gap-2 p-4">
        {navigationItems.map(({ path, icon: Icon, label }) => (
          <Button
            key={path}
            variant={location.pathname.startsWith(path) ? "secondary" : "ghost"}
            className={`justify-start ${isExpanded ? 'w-full' : 'w-8 p-2'}`}
            onClick={() => navigate(path)}
          >
            <Icon className="h-4 w-4" />
            {isExpanded && <span className="ml-2">{label}</span>}
          </Button>
        ))}
      </div>
    </nav>
  );
};