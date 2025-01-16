import { motion } from "framer-motion";
import { Database, Cloud, Workflow, Shield, Cpu, Network, Brain, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Hero from "@/components/Hero";
import { EngineerMessages } from "@/components/AICivilEngineer/EngineerMessages";
import { useSystemLogger } from "@/hooks/useSystemLogger";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const MicroserviceCard = ({ icon: Icon, title, description, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full"
  >
    <Card className={`h-full glass-morphism hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="rounded-full p-3 bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Index() {
  const { logSystemEvent } = useSystemLogger();
  const { toast } = useToast();

  useEffect(() => {
    logSystemEvent({
      level: 'info',
      message: 'User accessed microservices dashboard',
      context: {
        component: 'Index',
        route: '/',
        metrics: {
          timestamp: new Date().toISOString()
        }
      }
    });
  }, []);

  const microservices = [
    {
      icon: Database,
      title: "API Gateway",
      description: "Centralized access point for all microservices",
      className: "bg-blue-500/10 hover:bg-blue-500/20"
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Scalable cloud-native architecture",
      className: "bg-purple-500/10 hover:bg-purple-500/20"
    },
    {
      icon: Shield,
      title: "Security Layer",
      description: "Advanced security and authentication",
      className: "bg-red-500/10 hover:bg-red-500/20"
    },
    {
      icon: Workflow,
      title: "Workflow Engine",
      description: "Automated process orchestration",
      className: "bg-green-500/10 hover:bg-green-500/20"
    },
    {
      icon: Brain,
      title: "AI Services",
      description: "Intelligent processing and analysis",
      className: "bg-yellow-500/10 hover:bg-yellow-500/20"
    },
    {
      icon: Network,
      title: "Service Mesh",
      description: "Service discovery and communication",
      className: "bg-indigo-500/10 hover:bg-indigo-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Hero />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gradient-primary mb-4">
            Microservices Architecture
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our distributed system of specialized services working together to provide
            a seamless building analysis experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {microservices.map((service, index) => (
            <MicroserviceCard key={index} {...service} />
          ))}
        </div>

        <EngineerMessages />
      </motion.div>
    </div>
  );
}