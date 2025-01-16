import { Link } from "react-router-dom";
import { ChevronDown, Brain, Building2, Network, Cpu, Settings, Sparkles, Archive, Bug, Server, Share, Computer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
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

      <Link
        to="/solutions"
        className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
      >
        Solutions
      </Link>

      {/* Legacy Pages Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Archive className="mr-2 h-5 w-5" />
          Legacy Versions
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Previous Versions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to="/legacy/parcel-analysis" className="w-full">Legacy Parcel Analysis</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/legacy/property-details" className="w-full">Legacy Property Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/legacy/assessment-view" className="w-full">Legacy Assessment View</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/legacy/agent-dashboard" className="w-full flex items-center">
                <Bug className="mr-2 h-4 w-4" />
                Legacy Agent Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/legacy/debug-console" className="w-full flex items-center">
                <Computer className="mr-2 h-4 w-4" />
                Legacy Debug Console
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/legacy/system-intelligence" className="w-full flex items-center">
                <Server className="mr-2 h-4 w-4" />
                Legacy System Intelligence
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/legacy/shared-computer" className="w-full flex items-center">
                <Share className="mr-2 h-4 w-4" />
                Legacy Shared Computer
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Enterprise Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Building2 className="mr-2 h-5 w-5" />
          Enterprise
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Enterprise Solutions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to="/enterprise" className="w-full">Overview</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/enterprise/planning" className="w-full">Resource Planning</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/enterprise/analytics" className="w-full">Analytics Dashboard</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Infrastructure Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Network className="mr-2 h-5 w-5" />
          Infrastructure
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Infrastructure Management</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to="/infrastructure" className="w-full">Overview</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/infrastructure/network" className="w-full">Network Management</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/infrastructure/security" className="w-full">Security Monitoring</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Technology Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Cpu className="mr-2 h-5 w-5" />
          Technology
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Technology Hub</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to="/technology" className="w-full">Overview</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/technology/innovation" className="w-full">Innovation Lab</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/technology/research" className="w-full">Research Center</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Operations Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Settings className="mr-2 h-5 w-5" />
          Operations
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Business Operations</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to="/operations" className="w-full">Overview</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/operations/workflow" className="w-full">Workflow Management</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/operations/reporting" className="w-full">Reports & Analytics</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Innovation Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <Sparkles className="mr-2 h-5 w-5" />
          Innovation
          <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Innovation Center</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to="/innovation" className="w-full">Overview</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/innovation/lab" className="w-full">Lab Projects</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/innovation/experiments" className="w-full">Experiments</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        to="/learn-more"
        className="px-4 py-2 text-gray-700 hover:text-[#8B5CF6] transition-colors duration-200 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
      >
        Learn More
      </Link>
    </div>
  );
};
