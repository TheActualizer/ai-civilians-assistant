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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar session={session} />
      
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 min-h-[calc(100vh-8rem)]">
          
          {/* Main Content Panel (2/3 width) */}
          <div className="xl:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-10 border border-gray-700/50 shadow-2xl"
            >
              <h1 className="text-5xl font-bold text-gray-100 mb-4 tracking-tight">
                System Command Center
              </h1>
              <p className="text-2xl text-gray-400 leading-relaxed">
                Direct interface with Claude, CTO of our trillion-dollar tech company
              </p>
            </motion.div>

            {/* Main Command Interface */}
            <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl min-h-[calc(100vh-20rem)]">
              <CardContent className="p-10 h-full">
                <Tabs defaultValue="command-center" className="h-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-xl p-1">
                    <TabsTrigger value="command-center" className="text-xl py-4">Command Center</TabsTrigger>
                    <TabsTrigger value="system-analysis" className="text-xl py-4">System Analysis</TabsTrigger>
                    <TabsTrigger value="agent-coordination" className="text-xl py-4">Agent Coordination</TabsTrigger>
                  </TabsList>

                  <div className="mt-10 h-[calc(100%-6rem)] overflow-auto">
                    <TabsContent value="command-center" className="h-full space-y-8">
                      <ClaudeAnalysis 
                        pageRoute="/learn-more"
                        agentState={{
                          agents: [],
                          actions: []
                        }}
                        onThreadCreated={(threadId) => setActiveThreadId(threadId)}
                      />
                    </TabsContent>

                    <TabsContent value="system-analysis">
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <div className="space-y-8">
                          <Terminal className="h-24 w-24 mx-auto text-gray-500" />
                          <p className="text-2xl">System analysis module will be activated soon...</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="agent-coordination">
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <div className="space-y-8">
                          <Network className="h-24 w-24 mx-auto text-gray-500" />
                          <p className="text-2xl">Agent coordination module will be activated soon...</p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel (1/3 width) */}
          <div className="space-y-8">
            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 p-8">
                    <Terminal className="h-8 w-8 text-green-400" />
                    <CardTitle className="text-2xl text-gray-100">Command Interface</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 p-8">
                    <Network className="h-8 w-8 text-blue-400" />
                    <CardTitle className="text-2xl text-gray-100">Thread Analysis</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>

            {/* Metrics Panel */}
            {activeThreadId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center gap-4 p-4">
                      <Cpu className="h-8 w-8 text-purple-400" />
                      <CardTitle className="text-2xl text-gray-100">System Metrics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ClaudeMetrics threadId={activeThreadId} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;