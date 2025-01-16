import { useEffect, useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "../Navbar";
import { NavigationControls } from "../navigation/NavigationControls";
import { DebugPanel } from "../DebugPanel/DebugPanel";
import { ClaudeAnalysis } from "../Agents/ClaudeAnalysis";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [systemState, setSystemState] = useState({
    isAnalyzing: false,
    currentRoute: window.location.pathname,
    threadId: null as string | null,
    isSidebarCollapsed: false
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
          title: "Claude System Initialized",
          description: "AI system control active and monitoring",
        });
      } catch (error) {
        console.error('Error initializing Claude system:', error);
        toast({
          variant: "destructive",
          title: "System Initialization Error",
          description: "Failed to initialize Claude system control",
        });
      }
    };

    initializeClaudeSystem();
  }, [session, toast]);

  const toggleSidebar = () => {
    setSystemState(prev => ({
      ...prev,
      isSidebarCollapsed: !prev.isSidebarCollapsed
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary-light dark:from-gray-900 dark:to-gray-800">
      <Navbar session={session} />
      
      <div className="flex min-h-screen">
        <NavigationControls />
        
        <main className={`flex-1 transition-all duration-300 ${
          systemState.isSidebarCollapsed ? 'ml-16' : 'ml-16 lg:ml-64'
        } px-4 sm:px-6 lg:px-8 py-20`}>
          <div className="max-w-[1920px] mx-auto">
            {children}
          </div>
        </main>

        <div className={`fixed right-0 top-20 bottom-0 transition-all duration-300 ${
          systemState.isSidebarCollapsed ? 'w-12' : 'w-96'
        } glass-morphism border-l border-white/20 dark:border-gray-800/20`}>
          <button
            onClick={toggleSidebar}
            className="absolute -left-4 top-4 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary-600 transition-colors"
          >
            {systemState.isSidebarCollapsed ? '←' : '→'}
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
                  actions: [],
                  currentPhase: 'monitoring',
                  isProcessing: systemState.isAnalyzing
                }}
                onThreadCreated={(id) => {
                  console.log('Claude thread created:', id);
                  setSystemState(prev => ({ ...prev, threadId: id }));
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};