import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap, Terminal, Network, Cpu, Boxes, LayoutGrid, Workflow } from "lucide-react";
import Navbar from "@/components/Navbar";
import { ClaudeAnalysis } from "@/components/Agents/ClaudeAnalysis";
import { ClaudeMetrics } from "@/components/Agents/ClaudeMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const LearnMore = () => {
  const session = useSession();
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar session={session} />
      
      <div className="container mx-auto px-4 py-8 max-w-[2400px]">
        {/* Hero Section with Expanded Height */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-16 mb-12 border border-gray-700/50 shadow-2xl min-h-[400px] flex flex-col justify-center"
        >
          <h1 className="text-7xl font-bold text-gray-100 mb-8 tracking-tight leading-tight">
            System Command <br />& Control Center
          </h1>
          <p className="text-3xl text-gray-400 leading-relaxed max-w-4xl">
            Direct interface with Claude, our trillion-dollar tech company's Chief Technology Officer. 
            Orchestrate system-wide improvements and monitor real-time performance metrics.
          </p>
          <div className="flex gap-4 mt-12">
            <Badge variant="outline" className="px-6 py-3 text-xl bg-blue-500/10 text-blue-400">
              <Network className="w-6 h-6 mr-2" />
              Connected Systems: 42
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-xl bg-green-500/10 text-green-400">
              <Cpu className="w-6 h-6 mr-2" />
              Active Agents: 7
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-xl bg-purple-500/10 text-purple-400">
              <Boxes className="w-6 h-6 mr-2" />
              Processing Threads: 156
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Main Content Panel (2/3 width) */}
          <div className="xl:col-span-2 space-y-8">
            {/* Command Interface */}
            <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardContent className="p-10">
                <Tabs defaultValue="command-center" className="h-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-xl p-2">
                    <TabsTrigger value="command-center" className="text-xl py-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Terminal className="w-6 h-6 mr-3" />
                      Command Center
                    </TabsTrigger>
                    <TabsTrigger value="system-analysis" className="text-xl py-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <LayoutGrid className="w-6 h-6 mr-3" />
                      System Analysis
                    </TabsTrigger>
                    <TabsTrigger value="agent-coordination" className="text-xl py-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Workflow className="w-6 h-6 mr-3" />
                      Agent Coordination
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-10 min-h-[800px]">
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
                          <Terminal className="h-32 w-32 mx-auto text-gray-500" />
                          <p className="text-3xl">System analysis module will be activated soon...</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="agent-coordination">
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <div className="space-y-8">
                          <Network className="h-32 w-32 mx-auto text-gray-500" />
                          <p className="text-3xl">Agent coordination module will be activated soon...</p>
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
                className="group"
              >
                <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/60">
                  <CardHeader className="flex flex-row items-center gap-4 p-8">
                    <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                      <Terminal className="h-8 w-8 text-green-400" />
                    </div>
                    <CardTitle className="text-2xl text-gray-100">Command Interface</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="group"
              >
                <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-800/60">
                  <CardHeader className="flex flex-row items-center gap-4 p-8">
                    <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <Network className="h-8 w-8 text-blue-400" />
                    </div>
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
                      <div className="p-3 rounded-xl bg-purple-500/10">
                        <Cpu className="h-8 w-8 text-purple-400" />
                      </div>
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