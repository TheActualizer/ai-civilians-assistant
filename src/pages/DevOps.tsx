import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { GitBranch, Terminal, Server, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const DevOps = () => {
  const session = useSession();

  const features = [
    {
      title: "CI/CD Pipeline",
      description: "Automated build, test, and deployment workflows",
      icon: GitBranch,
      color: "text-blue-500"
    },
    {
      title: "Infrastructure as Code",
      description: "Version-controlled infrastructure management",
      icon: Terminal,
      color: "text-green-500"
    },
    {
      title: "Container Orchestration",
      description: "Scalable container deployment and management",
      icon: Server,
      color: "text-purple-500"
    },
    {
      title: "Continuous Monitoring",
      description: "Real-time system monitoring and alerts",
      icon: RefreshCw,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar session={session} />
      
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            DevOps
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamlined development operations and infrastructure management
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gray-100 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevOps;