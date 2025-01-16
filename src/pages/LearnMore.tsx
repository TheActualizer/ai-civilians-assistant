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
    <div className="min-h-screen bg-gray-900">
      <Navbar session={session} />
      
      {/* Main workspace with video call quality layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[calc(100vh-8rem)]">
          
          {/* Main Content Panel (2/3 width) - Command Center */}
          <div className="xl:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 shadow-2xl"
            >
              <h1 className="text-4xl font-bold text-gray-100 mb-3">
                System Command Center
              </h1>
              <p className="text-xl text-gray-400">
                Direct interface with Claude, CTO of our trillion-dollar tech company
              </p>
            </motion.div>

            {/* Main Command Interface */}
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl min-h-[calc(100vh-24rem)]">
              <CardContent className="p-8 h-full">
                <Tabs defaultValue="command-center" className="h-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-xl">
                    <TabsTrigger value="command-center" className="text-lg py-3">Command Center</TabsTrigger>
                    <TabsTrigger value="system-analysis" className="text-lg py-3">System Analysis</TabsTrigger>
                    <TabsTrigger value="agent-coordination" className="text-lg py-3">Agent Coordination</TabsTrigger>
                  </TabsList>

                  <div className="mt-8 h-[calc(100%-5rem)] overflow-auto">
                    <TabsContent value="command-center" className="h-full">
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
                        <div className="space-y-6">
                          <Terminal className="h-16 w-16 mx-auto text-gray-500" />
                          <p className="text-xl">System analysis module will be activated soon...</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="agent-coordination">
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <div className="space-y-6">
                          <Network className="h-16 w-16 mx-auto text-gray-500" />
                          <p className="text-xl">Agent coordination module will be activated soon...</p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel (1/3 width) - Metrics & Controls */}
          <div className="space-y-6">
            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardHeader className="flex flex-row items-center gap-3 p-6">
                  <Terminal className="h-6 w-6 text-green-400" />
                  <CardTitle className="text-lg text-gray-100">Command Interface</CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardHeader className="flex flex-row items-center gap-3 p-6">
                  <Network className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-lg text-gray-100">Thread Analysis</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Metrics Panel */}
            {activeThreadId && (
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-3 p-2">
                    <Cpu className="h-6 w-6 text-purple-400" />
                    <CardTitle className="text-lg text-gray-100">System Metrics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ClaudeMetrics threadId={activeThreadId} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;