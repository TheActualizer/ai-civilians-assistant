import { motion } from "framer-motion";
import { Database, Cloud, Workflow, Shield, Brain, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Hero from "@/components/Hero";
import { EngineerMessages } from "@/components/AICivilEngineer/EngineerMessages";
import { useSystemLogger } from "@/hooks/useSystemLogger";
import { useEffect, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { LazyLoadedSection } from "@/components/home/LazyLoadedSection";

const MicroserviceCard = ({ icon: Icon, title, description, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-white/5 p-6 rounded-lg border border-white/10 hover:border-primary/50 transition-colors ${className}`}
  >
    <Icon className="h-8 w-8 text-primary mb-4" />
    <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const Index = () => {
  const { logSystemEvent } = useSystemLogger();
  const { toast } = useToast();

  useEffect(() => {
    logSystemEvent("User accessed microservices dashboard", {
      component: 'Index',
      route: '/',
      metrics: {
        executionTime: performance.now(),
        memoryUsage: window.performance?.memory?.usedJSHeapSize || 0,
        apiLatency: 0
      }
    });
  }, [logSystemEvent]);

  const microservices = [
    {
      icon: Database,
      title: "Data Management",
      description: "Manage and analyze your data efficiently."
    },
    {
      icon: Cloud,
      title: "Cloud Services",
      description: "Leverage cloud computing for scalability."
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Automate your workflows for better productivity."
    },
    {
      icon: Shield,
      title: "Security Services",
      description: "Ensure the security of your applications."
    },
    {
      icon: Brain,
      title: "AI Services",
      description: "Integrate AI capabilities into your applications."
    },
    {
      icon: Network,
      title: "Network Management",
      description: "Monitor and manage your network infrastructure."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <Hero />
      </Suspense>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <LazyLoadedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient-primary mb-4">
              Microservices Architecture
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our distributed system of specialized services working together to provide
              a seamless building analysis experience.
            </p>
          </div>
        </LazyLoadedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {microservices.map((service, index) => (
            <LazyLoadedSection key={index} delay={index * 0.1}>
              <MicroserviceCard {...service} />
            </LazyLoadedSection>
          ))}
        </div>

        <LazyLoadedSection delay={0.3}>
          <EngineerMessages />
        </LazyLoadedSection>
      </motion.div>
    </div>
  );
};

export default Index;
