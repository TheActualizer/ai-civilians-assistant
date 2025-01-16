import { Link } from "react-router-dom";
import { ChevronDown, Brain, Building2, Database, Shield, Network, Cloud, Code, Bot, BarChart2, Users, Briefcase, TrendingUp, Truck, CheckSquare, Lightbulb } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define navigation structure for better maintainability
const navigationGroups = {
  enterprise: {
    icon: Building2,
    items: [
      { path: "/analytics", label: "Analytics" },
      { path: "/project-management", label: "Project Management" },
      { path: "/resource-allocation", label: "Resource Allocation" },
      { path: "/compliance-hub", label: "Compliance Hub" },
      { path: "/strategic-planning", label: "Strategic Planning" },
    ]
  },
  infrastructure: {
    icon: Database,
    items: [
      { path: "/data-center", label: "Data Center" },
      { path: "/security-operations", label: "Security Operations" },
      { path: "/network-infrastructure", label: "Network Infrastructure" },
      { path: "/cloud-services", label: "Cloud Services" },
    ]
  },
  technology: {
    icon: Code,
    items: [
      { path: "/api-gateway", label: "API Gateway" },
      { path: "/machine-learning", label: "Machine Learning" },
      { path: "/devops", label: "DevOps" },
      { path: "/automation", label: "Automation" },
    ]
  },
  business: {
    icon: Briefcase,
    items: [
      { path: "/business-intelligence", label: "Business Intelligence" },
      { path: "/customer-success", label: "Customer Success" },
      { path: "/financial-services", label: "Financial Services" },
      { path: "/human-resources", label: "Human Resources" },
    ]
  },
  innovation: {
    icon: Lightbulb,
    items: [
      { path: "/supply-chain", label: "Supply Chain" },
      { path: "/quality-assurance", label: "Quality Assurance" },
      { path: "/research", label: "Research" },
      { path: "/innovation", label: "Innovation Lab" },
    ]
  },
};

export const NavLinks = () => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <Link
        to="/ai-civil-engineer"
        className="flex items-center px-4 py-2 text-primary font-semibold hover:text-primary/90 transition-colors duration-200 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
      >
        <Brain className="mr-2 h-5 w-5" />
        AI Civil Engineer
      </Link>

      {Object.entries(navigationGroups).map(([key, group]) => {
        const Icon = group.icon;
        return (
          <DropdownMenu key={key}>
            <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
              <Icon className="mr-2 h-5 w-5" />
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {group.items.map((item) => (
                <DropdownMenuItem key={item.path}>
                  <Link to={item.path} className="w-full">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
};