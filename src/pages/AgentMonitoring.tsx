import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";
import { AgentMetrics } from "@/components/Agents/AgentMetrics";
import { AgentNetwork } from "@/components/Agents/AgentNetwork";
import { AgentsPanel } from "@/components/Agents/AgentsPanel";
import { useState } from "react";

const AgentMonitoring = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [apiCallHistory, setApiCallHistory] = useState<Array<{
    timestamp: string;
    event: string;
    details?: any;
  }>>([]);

  const handleMessageSubmit = (message: string) => {
    setApiCallHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      event: "User message",
      details: { message }
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <div className="flex w-full min-h-[calc(100vh-4rem)]">
        <DebugPanel
          isLoading={false}
          error={null}
          requestId={null}
          lightboxData={null}
          apiCallHistory={apiCallHistory}
          apiError={null}
          onRetry={() => {}}
          onMessageSubmit={handleMessageSubmit}
        />
        
        <div className="flex-1 container mx-auto px-4 py-8 pt-20">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => navigate('/ai-civil-engineer')}
              variant="outline"
              className="gap-2 text-gray-300 hover:text-white"
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
                  setApiCallHistory(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    event: `Agent ${agent} message`,
                    details: { message }
                  }]);
                }}
                onVoiceInput={async (transcript: string) => {
                  setApiCallHistory(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    event: "Voice input received",
                    details: { transcript }
                  }]);
                }}
                messages={[]}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentMonitoring;