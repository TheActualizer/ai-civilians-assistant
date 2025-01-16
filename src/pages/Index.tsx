import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap, Building2, FileText, Settings, Database, Network, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Features from "@/components/Features";
import { CoreFeatures } from "@/components/home/CoreFeatures";
import { HubSection } from "@/components/home/HubSection";
import { PageSelector } from "@/components/VersionManagement/PageSelector";

const Index = () => {
  useEffect(() => {
    console.log('Index page mounted');
  }, []);

  const enterpriseRoutes = [
    { path: "/enterprise/overview", label: "Overview", icon: Building2 },
    { path: "/enterprise/analytics", label: "Analytics", icon: FileText },
    { path: "/enterprise/system-analytics", label: "System Analytics", icon: Settings },
  ];

  const infrastructureRoutes = [
    { path: "/infrastructure/overview", label: "Overview", icon: Database },
    { path: "/infrastructure/network-management", label: "Network", icon: Network },
    { path: "/infrastructure/security-monitoring", label: "Security", icon: Settings },
  ];

  const technologyRoutes = [
    { path: "/technology/overview", label: "Overview", icon: Code },
    { path: "/technology/innovation", label: "Innovation", icon: Sparkles },
    { path: "/technology/research", label: "Research", icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Main Content */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"
          >
            AI Civil Engineer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-400"
          >
            Revolutionizing property analysis with advanced AI
          </motion.p>
        </div>

        {/* Main AI Assistant Button */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-16"
        >
          <Link to="/ai-civil-engineer">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Brain className="mr-2 h-6 w-6" />
              Launch AI Assistant
            </Button>
          </Link>
        </motion.div>

        {/* Hub Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <HubSection 
            title="Enterprise" 
            icon={Building2}
            routes={enterpriseRoutes}
          />
          <HubSection 
            title="Infrastructure" 
            icon={Database}
            routes={infrastructureRoutes}
          />
          <HubSection 
            title="Technology" 
            icon={Code}
            routes={technologyRoutes}
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Features />
        </div>

        {/* Core Features Section */}
        <CoreFeatures />

        {/* Page Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-16"
        >
          <PageSelector />
        </motion.div>

      </div>
    </div>
  );
};

export default Index;
