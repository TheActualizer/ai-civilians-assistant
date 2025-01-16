import { Link } from "react-router-dom";
import { ChevronDown, Brain, Building2, Network, Cpu, Settings, Sparkles, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { removeDuplicateNavItems, useNavItemValidation } from "@/utils/navigationUtils";

const baseNavItems = [
  {
    path: "/ai-civil-engineer",
    label: "AI Civil Engineer",
    icon: <Brain className="mr-2 h-5 w-5" />,
  },
  {
    path: "/solutions",
    label: "Solutions",
  },
  {
    path: "/legacy",
    label: "Legacy Versions",
    icon: <Archive className="mr-2 h-5 w-5" />,
    children: [
      { path: "/legacy/parcel-analysis", label: "Legacy Parcel Analysis" },
      { path: "/legacy/property-details", label: "Legacy Property Details" },
      { path: "/legacy/assessment-view", label: "Legacy Assessment View" },
      { path: "/zoning-analysis", label: "Zoning Analysis" },
    ],
  },
  {
    path: "/enterprise",
    label: "Enterprise",
    icon: <Building2 className="mr-2 h-5 w-5" />,
    children: [
      { path: "/enterprise", label: "Overview" },
      { path: "/enterprise/planning", label: "Resource Planning" },
      { path: "/enterprise/analytics", label: "Analytics Dashboard" },
    ],
  },
  {
    path: "/infrastructure",
    label: "Infrastructure",
    icon: <Network className="mr-2 h-5 w-5" />,
    children: [
      { path: "/infrastructure", label: "Overview" },
      { path: "/infrastructure/network", label: "Network Management" },
      { path: "/infrastructure/security", label: "Security Monitoring" },
    ],
  },
  {
    path: "/technology",
    label: "Technology",
    icon: <Cpu className="mr-2 h-5 w-5" />,
    children: [
      { path: "/technology", label: "Overview" },
      { path: "/technology/innovation", label: "Innovation Lab" },
      { path: "/technology/research", label: "Research Center" },
    ],
  },
  {
    path: "/operations",
    label: "Operations",
    icon: <Settings className="mr-2 h-5 w-5" />,
    children: [
      { path: "/operations", label: "Overview" },
      { path: "/operations/workflow", label: "Workflow Management" },
      { path: "/operations/reporting", label: "Reports & Analytics" },
    ],
  },
  {
    path: "/innovation",
    label: "Innovation",
    icon: <Sparkles className="mr-2 h-5 w-5" />,
    children: [
      { path: "/innovation", label: "Overview" },
      { path: "/innovation/lab", label: "Lab Projects" },
      { path: "/innovation/experiments", label: "Experiments" },
    ],
  },
];

export const NavLinks = () => {
  const { validateNavStructure } = useNavItemValidation();
  const navItems = removeDuplicateNavItems(baseNavItems);
  
  // Validate nav structure in development
  if (process.env.NODE_ENV === 'development') {
    validateNavStructure(navItems);
  }

  const renderDropdownItems = (items: typeof baseNavItems) => {
    return items.map((item) => (
      <DropdownMenuItem key={item.path}>
        <Link to={item.path} className="w-full flex items-center">
          {item.icon}
          {item.label}
        </Link>
      </DropdownMenuItem>
    ));
  };

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => 
        item.children ? (
          <DropdownMenu key={item.path}>
            <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
              {item.icon}
              {item.label}
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
              <DropdownMenuGroup>
                {renderDropdownItems(item.children)}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 ${
              item.path === "/ai-civil-engineer"
                ? "text-primary font-semibold hover:text-primary/90"
                : "text-gray-700 hover:text-[#8B5CF6]"
            } transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200`}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      )}
    </div>
  );
};
