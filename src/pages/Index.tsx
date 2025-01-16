import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CoreFeatures } from "@/components/home/CoreFeatures";
import { HubSection } from "@/components/home/HubSection";
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
import { motion } from "framer-motion";

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

        {/* Core Features Grid */}
        <CoreFeatures />

        {/* Hub Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <HubSection
            title="Enterprise Solutions"
            icon={Building2}
            routes={[
              { path: "/enterprise", label: "Enterprise Overview" },
              { path: "/enterprise/planning", label: "Resource Planning" },
              { path: "/enterprise/analytics", label: "Analytics Dashboard" }
            ]}
          />

          <HubSection
            title="Infrastructure"
            icon={Network}
            routes={[
              { path: "/infrastructure", label: "Infrastructure Overview" },
              { path: "/infrastructure/network", label: "Network Management" },
              { path: "/infrastructure/security", label: "Security Monitoring" }
            ]}
          />
        </div>

        {/* Technology & Operations */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <HubSection
            title="Technology"
            icon={Cpu}
            routes={[
              { path: "/technology", label: "Technology Hub" },
              { path: "/technology/innovation", label: "Innovation Lab" },
              { path: "/technology/research", label: "Research Center" }
            ]}
          />

          <HubSection
            title="Operations"
            icon={Settings}
            routes={[
              { path: "/operations", label: "Operations Hub" },
              { path: "/operations/workflow", label: "Workflow Management" },
              { path: "/operations/reporting", label: "Reports & Analytics" }
            ]}
          />
        </div>

        {/* Innovation & Resources */}
        <div className="grid md:grid-cols-2 gap-6">
          <HubSection
            title="Innovation Center"
            icon={Sparkles}
            routes={[
              { path: "/innovation", label: "Innovation Hub" },
              { path: "/innovation/lab", label: "Lab Projects" },
              { path: "/innovation/experiments", label: "Experiments" }
            ]}
          />

          <HubSection
            title="Additional Resources"
            icon={BookOpen}
            routes={[
              { path: "/learn-more", label: "Learn More" },
              { path: "/legacy/parcel-analysis", label: "Legacy Systems", icon: Archive }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;