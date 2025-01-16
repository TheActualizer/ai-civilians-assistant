import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Brain, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Features from "@/components/Features";
import { CoreFeatures } from "@/components/home/CoreFeatures";
import { HubSection } from "@/components/home/HubSection";
import { PageSelector } from "@/components/VersionManagement/PageSelector";
import { VersionSwitcher } from "@/components/VersionSwitcher/VersionSwitcher";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  LazyLoadSection, 
  useLazyLoad, 
  fadeInVariants, 
  flowVariants,
  staggerChildren,
  contentFlow 
} from '@/utils/lazyLoadingController';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const heroLazyLoad = useLazyLoad({ threshold: 0.2 });
  const versionLazyLoad = useLazyLoad({ threshold: 0.1 });
  const featuresLazyLoad = useLazyLoad({ threshold: 0.1 });

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('🔄 Initializing system...');
        
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
        <LazyLoadSection
          ref={heroLazyLoad.ref}
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="text-center mb-12"
        >
          <motion.h1 
            variants={flowVariants}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"
          >
            AI Civil Engineer
          </motion.h1>
          <motion.p
            variants={contentFlow}
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
        </LazyLoadSection>

        <LazyLoadSection
          ref={versionLazyLoad.ref}
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          <motion.div variants={fadeInVariants}>
            <PageSelector />
          </motion.div>
          <motion.div variants={fadeInVariants}>
            <VersionSwitcher />
          </motion.div>
        </LazyLoadSection>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
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

        <LazyLoadSection
          ref={featuresLazyLoad.ref}
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mb-16"
        >
          <motion.div variants={fadeInVariants}>
            <Features />
          </motion.div>
        </LazyLoadSection>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div variants={fadeInVariants}>
            <CoreFeatures />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;