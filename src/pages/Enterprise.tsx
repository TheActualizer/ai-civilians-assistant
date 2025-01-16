import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Building2, BarChart3, FolderKanban, Scale, Target, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Enterprise = () => {
  const session = useSession();

  const enterpriseModules = [
    {
      title: "Analytics & Insights",
      description: "Advanced analytics and business intelligence platform",
      icon: BarChart3,
      link: "/analytics",
      color: "text-blue-500"
    },
    {
      title: "Project Management",
      description: "Enterprise-grade project and portfolio management",
      icon: FolderKanban,
      link: "/project-management",
      color: "text-purple-500"
    },
    {
      title: "Resource Allocation",
      description: "Intelligent resource planning and optimization",
      icon: Users2,
      link: "/resource-allocation",
      color: "text-green-500"
    },
    {
      title: "Compliance Hub",
      description: "Regulatory compliance and risk management",
      icon: Scale,
      link: "/compliance-hub",
      color: "text-red-500"
    },
    {
      title: "Strategic Planning",
      description: "Long-term planning and strategy execution",
      icon: Target,
      link: "/strategic-planning",
      color: "text-amber-500"
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
            Enterprise Command Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unified platform for enterprise-scale operations, analytics, and strategic planning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enterpriseModules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={module.link} className="block h-full">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gray-100 ${module.color}`}>
                      <module.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{module.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-8">
              <Building2 className="w-16 h-16 mx-auto mb-6 opacity-75" />
              <h2 className="text-2xl font-bold mb-4">Ready to Scale?</h2>
              <p className="mb-6">
                Our enterprise solutions are designed to scale with your organization's growth
              </p>
              <Link
                to="/get-started"
                className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
              >
                Get Started with Enterprise
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Enterprise;