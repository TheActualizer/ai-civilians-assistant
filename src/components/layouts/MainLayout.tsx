import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";
import Navbar from "../Navbar";
import { NavigationControls } from "../navigation/NavigationControls";
import { DebugPanel } from "../DebugPanel/DebugPanel";
import { ClaudeAnalysis } from "../Agents/ClaudeAnalysis";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { MainLayoutProps } from '@/types/agent';

export const MainLayout = ({ children }: MainLayoutProps) => {
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [systemState, setSystemState] = useState({
    isAnalyzing: false,
    currentRoute: window.location.pathname,
    threadId: null as string | null,
    isSidebarCollapsed: true, // Changed to true by default
    isDebugPanelOpen: false // Changed to false by default
  });

  useEffect(() => {
    console.log('🔄 MainLayout rendering with session:', !!session);
    
    const initializeClaudeSystem = async () => {
      try {
        const { data: threadAnalysis, error } = await supabase
          .from('debug_thread_analysis')
          .insert({
            page_path: window.location.pathname,
            thread_type: 'system_control',
            analysis_status: 'active',
            auto_analysis_enabled: true,
            analysis_interval: 30000,
            analysis_data: {
              system_initialization: true,
              route_context: window.location.pathname,
              timestamp: new Date().toISOString()
            }
          })
          .select()
          .single();

        if (error) throw error;

        setSystemState(prev => ({
          ...prev,
          threadId: threadAnalysis.id
        }));

        toast({
          title: "System Initialized",
          description: "AI system control active",
        });
      } catch (error) {
        console.error('Error initializing system:', error);
        toast({
          variant: "destructive",
          title: "Initialization Error",
          description: "Failed to initialize system control",
        });
      }
    };

    initializeClaudeSystem();
  }, [session, toast]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    setSystemState(prev => ({
      ...prev,
      isSidebarCollapsed: true,
      isDebugPanelOpen: false
    }));
  }, [isMobile]);

  const toggleSidebar = () => {
    setSystemState(prev => ({
      ...prev,
      isSidebarCollapsed: !prev.isSidebarCollapsed
    }));
  };

  const toggleDebugPanel = () => {
    setSystemState(prev => ({
      ...prev,
      isDebugPanelOpen: !prev.isDebugPanelOpen
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary-light dark:from-gray-900 dark:to-gray-800">
      <Navbar session={session} />
      
      <div className="flex min-h-screen">
        <AnimatePresence mode="wait">
          {!systemState.isSidebarCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-20 bottom-0 z-40"
            >
              <NavigationControls onToggle={toggleSidebar} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className={`flex-1 transition-all duration-300 ${
          systemState.isSidebarCollapsed ? 'ml-0' : 'ml-16 lg:ml-64'
        } px-4 sm:px-6 lg:px-8 py-20`}>
          <div className="max-w-[1920px] mx-auto">
            {children}
          </div>
        </main>

        <AnimatePresence mode="wait">
          {systemState.isDebugPanelOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`fixed right-0 top-20 bottom-0 z-40 glass-morphism border-l border-white/20 dark:border-gray-800/20 ${
                isMobile ? 'w-full' : 'w-96'
              }`}
            >
              <button
                onClick={toggleDebugPanel}
                className="absolute -left-4 top-4 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary-600 transition-colors"
              >
                {systemState.isDebugPanelOpen ? '→' : '←'}
              </button>
              
              <div className="h-full overflow-y-auto">
                <DebugPanel 
                  isLoading={false}
                  error={null}
                  requestId={null}
                  lightboxData={null}
                  apiError={null}
                  apiCallHistory={[]}
                  onRetry={() => {}}
                  onMessageSubmit={() => {}}
                />
                {systemState.threadId && (
                  <ClaudeAnalysis 
                    pageRoute={systemState.currentRoute}
                    agentState={{
                      agents: [],
                      actions: []
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};