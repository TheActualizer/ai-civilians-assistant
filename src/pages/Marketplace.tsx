import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, FileText, LineChart, Ruler } from "lucide-react";

const products = [
  {
    title: "Zoning Analysis Report",
    description: "Comprehensive analysis of zoning regulations and restrictions",
    icon: Building2,
    price: "$99",
    features: [
      "Detailed zoning classification",
      "Permitted uses",
      "Building height restrictions",
      "Setback requirements",
      "FAR calculations"
    ]
  },
  {
    title: "Feasibility Study",
    description: "Evaluate the potential of your development project",
    icon: LineChart,
    price: "$149",
    features: [
      "Market analysis",
      "Site evaluation",
      "Development constraints",
      "Preliminary cost estimates",
      "ROI projections"
    ]
  },
  {
    title: "Building Code Review",
    description: "Ensure compliance with local building codes",
    icon: FileText,
    price: "$129",
    features: [
      "Code compliance check",
      "Safety requirements",
      "Accessibility standards",
      "Energy code analysis",
      "Required permits list"
    ]
  },
  {
    title: "Site Analysis Report",
    description: "Detailed evaluation of property characteristics",
    icon: Ruler,
    price: "$79",
    features: [
      "Topography analysis",
      "Soil conditions",
      "Utilities assessment",
      "Environmental factors",
      "Site constraints"
    ]
  }
];

const Marketplace = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      
      <div className="pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Engineering Reports
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get professional engineering analysis and reports at a fraction of the traditional cost
          </p>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <product.icon className="h-8 w-8 text-primary" />
                      <span className="text-2xl font-bold text-primary">
                        {product.price}
                      </span>
                    </div>
                    <CardTitle className="text-xl mt-4">{product.title}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-center text-gray-600">
                          <ArrowRight className="h-4 w-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to="/get-started">
                      <Button className="w-full mt-6">
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;