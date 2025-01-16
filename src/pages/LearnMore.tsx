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
      
      <div className="container mx-auto px-4 py-8">
        {/* Main content area with video call style layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          
          {/* Left panel - Command Center */}
          <div className="xl:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
            >
              <h1 className="text-3xl font-bold text-gray-100 mb-2">
                System Command Center
              </h1>
              <p className="text-lg text-gray-400">
                Direct interface with Claude, CTO of our trillion-dollar tech company
              </p>
            </motion.div>

            {/* Main video/content area */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 h-[calc(100vh-24rem)]">
              <CardContent className="p-6 h-full">
                <Tabs defaultValue="command-center" className="h-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700">
                    <TabsTrigger value="command-center">Command Center</TabsTrigger>
                    <TabsTrigger value="system-analysis">System Analysis</TabsTrigger>
                    <TabsTrigger value="agent-coordination">Agent Coordination</TabsTrigger>
                  </TabsList>

                  <div className="mt-6 h-[calc(100%-4rem)] overflow-auto">
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
                        <div className="space-y-4">
                          <Terminal className="h-12 w-12 mx-auto text-gray-500" />
                          <p>System analysis module will be activated soon...</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="agent-coordination">
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <div className="space-y-4">
                          <Network className="h-12 w-12 mx-auto text-gray-500" />
                          <p>Agent coordination module will be activated soon...</p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right panel - Metrics & Controls */}
          <div className="space-y-4">
            {/* Quick action cards */}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader className="flex flex-row items-center gap-2 p-4">
                  <Terminal className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-sm text-gray-100">Command Interface</CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader className="flex flex-row items-center gap-2 p-4">
                  <Network className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-sm text-gray-100">Thread Analysis</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Metrics panel */}
            {activeThreadId && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-purple-400" />
                    <CardTitle className="text-gray-100">System Metrics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
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