import Navbar from "@/components/Navbar";
import { Building2, LineChart, Map, Users, FileCheck, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const solutions = [
  {
    title: "Project Listings",
    description: "Browse and post construction projects, renovations, and development opportunities.",
    icon: Building2,
    color: "bg-blue-100",
  },
  {
    title: "Professional Network",
    description: "Connect with verified architects, engineers, and contractors.",
    icon: Users,
    color: "bg-green-100",
  },
  {
    title: "Feasibility Studies",
    description: "Access comprehensive project analysis and feasibility reports.",
    icon: LineChart,
    color: "bg-purple-100",
  },
  {
    title: "Zoning Maps",
    description: "Interactive zoning maps and property information.",
    icon: Map,
    color: "bg-yellow-100",
  },
  {
    title: "Permit Processing",
    description: "Streamlined permit application and tracking system.",
    icon: FileCheck,
    color: "bg-red-100",
  },
  {
    title: "Collaboration Tools",
    description: "Real-time messaging and project collaboration features.",
    icon: MessageSquare,
    color: "bg-indigo-100",
  },
];

const Solutions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              Construction & Development Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connecting professionals, property owners, and investors with the tools and services they need to succeed in construction and development projects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`${solution.color} p-3 rounded-lg inline-block mb-4`}>
                  <solution.icon className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {solution.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {solution.description}
                </p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;