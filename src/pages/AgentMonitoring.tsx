import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { AgentMetrics } from "@/components/Agents/AgentMetrics";
import { AgentNetwork } from "@/components/Agents/AgentNetwork";
import { AgentsPanel } from "@/components/Agents/AgentsPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgentMonitoring = () => {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/ai-civil-engineer')}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to AI Civil Engineer
          </Button>
          <h1 className="text-2xl font-bold text-white">Advanced Agent Monitoring</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AgentMetrics />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AgentNetwork />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AgentsPanel 
              onMessage={async (message: string, agent: string) => {
                console.log('Agent message:', { message, agent });
              }}
              onVoiceInput={async (transcript: string) => {
                console.log('Voice input:', transcript);
              }}
              messages={[]}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgentMonitoring;