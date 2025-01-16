import Navbar from "@/components/Navbar";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Network, 
  Cpu, 
  Settings, 
  Sparkles, 
  Archive, 
  Brain,
  BookOpen,
  ChevronRight
} from "lucide-react";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();

  console.log("🔄 Table of Contents page rendering...", { isAuthenticated: !!session });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar session={session} />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Civil Engineering Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive hub for AI-powered civil engineering solutions and analysis
          </p>
        </div>

        {/* Main Features */}
        <div className="grid gap-6 mb-12">
          <Button
            onClick={() => navigate("/ai-civil-engineer")}
            className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-lg h-auto"
          >
            <div className="flex items-center">
              <Brain className="h-6 w-6 mr-3" />
              <span>AI Civil Engineer Assistant</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Core Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enterprise Solutions</h2>
            <Button
              onClick={() => navigate("/enterprise")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <Building2 className="mr-2 h-5 w-5" />
              Enterprise Overview
            </Button>
            <Button
              onClick={() => navigate("/enterprise/planning")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Resource Planning
            </Button>
            <Button
              onClick={() => navigate("/enterprise/analytics")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Analytics Dashboard
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Infrastructure</h2>
            <Button
              onClick={() => navigate("/infrastructure")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <Network className="mr-2 h-5 w-5" />
              Infrastructure Overview
            </Button>
            <Button
              onClick={() => navigate("/infrastructure/network")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Network Management
            </Button>
            <Button
              onClick={() => navigate("/infrastructure/security")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Security Monitoring
            </Button>
          </div>
        </div>

        {/* Technology & Operations */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Technology</h2>
            <Button
              onClick={() => navigate("/technology")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <Cpu className="mr-2 h-5 w-5" />
              Technology Hub
            </Button>
            <Button
              onClick={() => navigate("/technology/innovation")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Innovation Lab
            </Button>
            <Button
              onClick={() => navigate("/technology/research")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Research Center
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Operations</h2>
            <Button
              onClick={() => navigate("/operations")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <Settings className="mr-2 h-5 w-5" />
              Operations Hub
            </Button>
            <Button
              onClick={() => navigate("/operations/workflow")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Workflow Management
            </Button>
            <Button
              onClick={() => navigate("/operations/reporting")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Reports & Analytics
            </Button>
          </div>
        </div>

        {/* Innovation & Resources */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Innovation Center</h2>
            <Button
              onClick={() => navigate("/innovation")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Innovation Hub
            </Button>
            <Button
              onClick={() => navigate("/innovation/lab")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Lab Projects
            </Button>
            <Button
              onClick={() => navigate("/innovation/experiments")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <ChevronRight className="mr-2 h-5 w-5" />
              Experiments
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Resources</h2>
            <Button
              onClick={() => navigate("/learn-more")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Learn More
            </Button>
            <Button
              onClick={() => navigate("/legacy/parcel-analysis")}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
            >
              <Archive className="mr-2 h-5 w-5" />
              Legacy Systems
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;