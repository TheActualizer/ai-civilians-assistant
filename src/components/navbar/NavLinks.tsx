import { Link } from "react-router-dom";
import { ChevronDown, Brain, Building2, Database, Shield, Network, Cloud, Code, Robot, BarChart2, Users, Briefcase, TrendingUp, Truck, CheckSquare, Lightbulb } from "lucide-react";
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
        className="flex items-center px-4 py-2 text-primary font-semibold hover:text-primary/90 transition-colors duration-200 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20"
      >
        <Brain className="mr-2 h-5 w-5" />
        AI Civil Engineer
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Building2 className="mr-2 h-5 w-5" />
          Enterprise
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Link to="/analytics" className="w-full">Analytics</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/project-management" className="w-full">Project Management</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/resource-allocation" className="w-full">Resource Allocation</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/compliance-hub" className="w-full">Compliance Hub</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/strategic-planning" className="w-full">Strategic Planning</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Database className="mr-2 h-5 w-5" />
          Infrastructure
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Link to="/data-center" className="w-full">Data Center</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/security-operations" className="w-full">Security Operations</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/network-infrastructure" className="w-full">Network Infrastructure</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/cloud-services" className="w-full">Cloud Services</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Code className="mr-2 h-5 w-5" />
          Technology
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Link to="/api-gateway" className="w-full">API Gateway</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/machine-learning" className="w-full">Machine Learning</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/devops" className="w-full">DevOps</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/automation" className="w-full">Automation</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Briefcase className="mr-2 h-5 w-5" />
          Business
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Link to="/business-intelligence" className="w-full">Business Intelligence</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/customer-success" className="w-full">Customer Success</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/financial-services" className="w-full">Financial Services</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/human-resources" className="w-full">Human Resources</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Lightbulb className="mr-2 h-5 w-5" />
          Innovation
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Link to="/supply-chain" className="w-full">Supply Chain</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/quality-assurance" className="w-full">Quality Assurance</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/research" className="w-full">Research</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/innovation" className="w-full">Innovation Lab</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};