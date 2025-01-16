import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, FileText, LineChart, Ruler } from "lucide-react";
import { NotificationFeed } from "@/components/notifications/NotificationFeed";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Solutions = () => {
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    // Log initial page load to debug_logs
    const logPageLoad = async () => {
      try {
        await supabase.from('debug_logs').insert({
          level: 'info',
          message: 'Solutions page initialized',
          source: 'solutions_page',
          context: { timestamp: new Date().toISOString() }
        });
      } catch (error) {
        console.error('Error logging page load:', error);
      }
    };

    logPageLoad();
  }, []);

  const solutions = [
    {
      title: "Zoning Analysis",
      description: "Get detailed insights into zoning regulations and restrictions for your property",
      icon: Building2,
      color: "text-blue-500",
    },
    {
      title: "Feasibility Studies",
      description: "Evaluate the potential of your development project with comprehensive analysis",
      icon: LineChart,
      color: "text-purple-500",
    },
    {
      title: "Building Area Calculations",
      description: "Calculate maximum buildable area and floor area ratios",
      icon: Ruler,
      color: "text-green-500",
    },
    {
      title: "Custom Reports",
      description: "Receive detailed reports tailored to your specific needs",
      icon: FileText,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center px-4 mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Our Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Comprehensive analysis and reports powered by AI to help you make informed decisions about your property development projects.
          </motion.p>
        </section>

        {/* Solutions Grid */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <solution.icon className={`h-12 w-12 ${solution.color} mb-4`} />
                    <CardTitle>{solution.title}</CardTitle>
                    <CardDescription>{solution.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/get-started">
                      <Button className="w-full">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Notification Feed */}
        <div className="fixed bottom-8 right-8 z-50">
          <NotificationFeed />
        </div>

        {/* CTA Section */}
        <section className="mt-16 text-center px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to start your project?</CardTitle>
              <CardDescription>
                Get your first analysis report in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/get-started">
                <Button size="lg" className="px-8">
                  Begin Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Solutions;