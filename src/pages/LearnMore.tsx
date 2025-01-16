import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap, Terminal, Network, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";
import { ClaudeAnalysis } from "@/components/Agents/ClaudeAnalysis";
import { ClaudeMetrics } from "@/components/Agents/ClaudeMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

const LearnMore = () => {
  const session = useSession();
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar session={session} />
      
      <div className="container mx-auto px-4 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            System Command Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Direct interface with Claude, CTO of our trillion-dollar tech company
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-green-400" />
                <CardTitle className="text-gray-100">Command Interface</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Direct strategic commands to Claude
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-gray-100">Thread Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Real-time system connections
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-gray-100">System Evolution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Continuous improvement tracking
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-gray-100">Agent Coordination</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Multi-agent system status
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="command-center" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <TabsTrigger value="command-center">Command Center</TabsTrigger>
            <TabsTrigger value="system-analysis">System Analysis</TabsTrigger>
            <TabsTrigger value="agent-coordination">Agent Coordination</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="command-center" className="space-y-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6">
                  <ClaudeAnalysis 
                    pageRoute="/learn-more"
                    agentState={{
                      agents: [],
                      actions: []
                    }}
                    onThreadCreated={(threadId) => setActiveThreadId(threadId)}
                  />
                </CardContent>
              </Card>
              
              {activeThreadId && (
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <ClaudeMetrics threadId={activeThreadId} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="system-analysis">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center text-gray-400">
                    System analysis module will be activated soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agent-coordination">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center text-gray-400">
                    Agent coordination module will be activated soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnMore;