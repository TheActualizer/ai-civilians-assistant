import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useSession } from "@supabase/auth-helpers-react";

const LearnMore = () => {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              How We Deliver Unmatched Precision
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
              Our advanced AI platform analyzes every zoning regulation, geospatial constraint, and buildable potential to give you the most accurate report.
            </p>
            <div className="mt-10">
              <Button 
                size="lg" 
                className="group"
                onClick={() => navigate("/get-started")}
              >
                Get Your Report Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Zoning Analysis Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Zoning Regulations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-500">
                      <li>• Comprehensive zoning code analysis</li>
                      <li>• FAR (Floor Area Ratio) compliance</li>
                      <li>• Maximum height restrictions</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Geospatial Calculations Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Geospatial Precision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-500">
                      <li>• Accurate setback calculations</li>
                      <li>• Parcel boundary analysis</li>
                      <li>• Lot coverage optimization</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Environmental Analysis Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Environmental Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-500">
                      <li>• Flood zone assessment</li>
                      <li>• Wetlands identification</li>
                      <li>• Fire lane compliance</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to See What's Possible?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Get your comprehensive building analysis report in minutes.
            </p>
            <div className="mt-8">
              <Button 
                size="lg" 
                className="group"
                onClick={() => navigate("/get-started")}
              >
                Get Started for $99
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default LearnMore;
