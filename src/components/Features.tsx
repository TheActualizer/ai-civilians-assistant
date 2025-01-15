import { Building2, LineChart, Map } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "Zoning Analysis",
    description: "Get detailed zoning reports with setbacks, FAR calculations, and compliance checks.",
    icon: Building2,
  },
  {
    name: "Feasibility Studies",
    description: "Analyze project feasibility with comprehensive reports and recommendations.",
    icon: LineChart,
  },
  {
    name: "Area Calculations",
    description: "Calculate maximum buildable area with interactive visualizations and maps.",
    icon: Map,
  },
];

const Features = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:text-center"
        >
          <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Services</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive Building Analysis
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Everything you need to analyze and optimize your building projects.
          </p>
        </motion.div>

        <div className="mt-20">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white shadow-lg transform transition-all duration-300 hover:scale-110">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;