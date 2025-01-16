import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Cloud, Database, Lock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const CloudServices = () => {
  const session = useSession();

  const services = [
    {
      title: "Cloud Storage",
      description: "Secure and scalable cloud storage solutions",
      icon: Database,
      color: "text-blue-500"
    },
    {
      title: "Cloud Security",
      description: "Advanced security and compliance measures",
      icon: Lock,
      color: "text-green-500"
    },
    {
      title: "Cloud Computing",
      description: "High-performance cloud computing resources",
      icon: Cloud,
      color: "text-purple-500"
    },
    {
      title: "Cloud Integration",
      description: "Seamless integration with existing systems",
      icon: Zap,
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
            Cloud Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise cloud solutions for modern business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gray-100 ${service.color}`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CloudServices;