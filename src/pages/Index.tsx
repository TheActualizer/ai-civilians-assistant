import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Features from "@/components/Features";
import { CoreFeatures } from "@/components/home/CoreFeatures";
import { HubSection } from "@/components/home/HubSection";

const Index = () => {
  useEffect(() => {
    console.log('Index page mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Main Content */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"
          >
            AI Civil Engineer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-600"
          >
            Revolutionizing property analysis with advanced AI
          </motion.p>
        </div>

        {/* Rest of the content */}
        {/* Main AI Assistant Button */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-16"
        >
          <Link to="/ai-civil-engineer">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Brain className="mr-2 h-6 w-6" />
              Launch AI Assistant
            </Button>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Features />
        </div>

        {/* Core Features Section */}
        <CoreFeatures />

        {/* Hub Navigation Section */}
        <HubSection />

        {/* Enterprise Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-8">
            <div className="text-center mb-8">
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Enterprise Features</h2>
              <p className="text-gray-300">Advanced capabilities for professional users</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/enterprise/overview" className="group">
                <Card className="bg-gray-800/50 border-gray-700 p-6 hover:bg-gray-800 transition-all duration-300">
                  <Brain className="h-8 w-8 text-purple-500 mb-4 group-hover:text-purple-400" />
                  <h3 className="text-xl font-semibold text-white mb-2">AI Command Center</h3>
                  <p className="text-gray-400">Centralized control for AI operations</p>
                </Card>
              </Link>
              
              <Link to="/enterprise/analytics" className="group">
                <Card className="bg-gray-800/50 border-gray-700 p-6 hover:bg-gray-800 transition-all duration-300">
                  <Zap className="h-8 w-8 text-blue-500 mb-4 group-hover:text-blue-400" />
                  <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                  <p className="text-gray-400">Deep insights and performance metrics</p>
                </Card>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
