import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Brain, Activity, AlertCircle, Settings, FileText, Network, Cpu, Database, Workflow, Mic, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaudeAnalysis } from '@/components/Agents/ClaudeAnalysis';
import { ClaudeMetrics } from '@/components/Agents/ClaudeMetrics';
import Navbar from "@/components/Navbar";
import { useState } from "react";

const FinancialServices = () => {
  const session = useSession();
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar session={session} />
      
      <div className="container mx-auto px-8 py-12 max-w-[2400px]">
        {/* Enterprise Command Center Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-20 mb-16 border border-gray-700/50 shadow-2xl min-h-[500px] flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x" />
          <div className="relative z-10">
            <h1 className="text-8xl font-bold text-gray-100 mb-10 tracking-tight leading-tight">
              Financial Services<br />Command Center
            </h1>
            <p className="text-4xl text-gray-400 leading-relaxed max-w-5xl mb-12">
              Advanced AI-powered analytics and decision support for financial services. 
              Real-time market analysis, risk assessment, and portfolio optimization.
            </p>
            <div className="flex flex-wrap gap-6">
              <Badge variant="outline" className="px-8 py-4 text-2xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-300">
                <Network className="w-8 h-8 mr-3" />
                Market Analysis
              </Badge>
              <Badge variant="outline" className="px-8 py-4 text-2xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all duration-300">
                <Cpu className="w-8 h-8 mr-3" />
                Risk Assessment
              </Badge>
              <Badge variant="outline" className="px-8 py-4 text-2xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all duration-300">
                <Database className="w-8 h-8 mr-3" />
                Portfolio Analytics
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Main Command Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          {/* Command Center (3/4 width) */}
          <div className="xl:col-span-3 space-y-10">
            <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-100">Financial Analysis Command Center</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-12">
                <Tabs defaultValue="command-center">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-xl p-3">
                    <TabsTrigger value="command-center" className="text-xl py-8">
                      <Terminal className="w-7 h-7 mr-3" />
                      Command Center
                    </TabsTrigger>
                    <TabsTrigger value="market-analysis" className="text-xl py-8">
                      <Activity className="w-7 h-7 mr-3" />
                      Market Analysis
                    </TabsTrigger>
                    <TabsTrigger value="risk-assessment" className="text-xl py-8">
                      <AlertCircle className="w-7 h-7 mr-3" />
                      Risk Assessment
                    </TabsTrigger>
                    <TabsTrigger value="portfolio" className="text-xl py-8">
                      <Database className="w-7 h-7 mr-3" />
                      Portfolio
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-12 min-h-[800px]">
                    <TabsContent value="command-center">
                      <ClaudeAnalysis 
                        pageRoute="/financial-services"
                        agentState={{
                          agents: [],
                          actions: []
                        }}
                        onThreadCreated={(threadId) => setActiveThreadId(threadId)}
                      />
                    </TabsContent>

                    <TabsContent value="market-analysis">
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <div className="space-y-8">
                          <Activity className="h-40 w-40 mx-auto text-gray-500" />
                          <p className="text-4xl">Market analysis module activating...</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="risk-assessment">
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <div className="space-y-8">
                          <AlertCircle className="h-40 w-40 mx-auto text-gray-500" />
                          <p className="text-4xl">Risk assessment module initializing...</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="portfolio">
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <div className="space-y-8">
                          <Database className="h-40 w-40 mx-auto text-gray-500" />
                          <p className="text-4xl">Portfolio analytics loading...</p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel (1/4 width) */}
          <div className="space-y-8">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 gap-6">
              {activeThreadId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-4 p-4">
                        <div className="p-4 rounded-xl bg-orange-500/10">
                          <Cpu className="h-10 w-10 text-orange-400" />
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
    </div>
  );
};

export default FinancialServices;
