import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Features from "@/components/Features";
import { CoreFeatures } from "@/components/home/CoreFeatures";
import { HubSection } from "@/components/home/HubSection";
import { PageSelector } from "@/components/VersionManagement/PageSelector";
import { VersionSwitcher } from "@/components/VersionSwitcher/VersionSwitcher";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('🔄 Initializing system...');
        
        // Create initial debug thread for system analysis
        const { data: threadAnalysis, error: threadError } = await supabase
          .from('debug_thread_analysis')
          .insert({
            page_path: '/',
            thread_type: 'system_initialization',
            analysis_status: 'active',
            auto_analysis_enabled: true,
            analysis_interval: 30000,
            analysis_data: {
              initialization_timestamp: new Date().toISOString(),
              route_context: '/',
              system_state: 'initializing'
            }
          })
          .select()
          .single();

        if (threadError) throw threadError;

        console.log('✅ System initialized:', threadAnalysis);
        
        toast({
          title: "System Initialized",
          description: "AI system is now active and monitoring",
        });
      } catch (err) {
        console.error('❌ System initialization error:', err);
        setError('Failed to initialize system');
        toast({
          variant: "destructive",
          title: "Initialization Error",
          description: "Failed to start AI system. Please try refreshing.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSystem();
  }, [toast]);

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
            className="text-xl text-gray-400 mt-4"
          >
            {isLoading ? (
              "Initializing AI system..."
            ) : error ? (
              "System initialization error - please refresh"
            ) : (
              "Revolutionizing property analysis with advanced AI"
            )}
          </motion.p>
        </div>

        {/* Version Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PageSelector />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <VersionSwitcher />
          </motion.div>
        </div>

        {/* Main AI Assistant Button */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-16"
        >
          <Link to="/ai-civil-engineer">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              disabled={isLoading || !!error}
            >
              {isLoading ? (
                <Zap className="mr-2 h-6 w-6 animate-pulse" />
              ) : error ? (
                <Sparkles className="mr-2 h-6 w-6 text-red-400" />
              ) : (
                <Brain className="mr-2 h-6 w-6" />
              )}
              {isLoading ? "Initializing..." : error ? "System Error" : "Launch AI Assistant"}
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16">
          <Features />
        </div>

        {/* Core Features Section */}
        <CoreFeatures />
      </div>
    </div>
  );
};

export default Index;