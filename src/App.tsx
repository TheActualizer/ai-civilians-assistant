import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import LearnMore from "./pages/LearnMore";
import Login from "./pages/Login";
import Solutions from "./pages/Solutions";
import Marketplace from "./pages/Marketplace";
import Orders from "./pages/Orders";
import NewReport from "./pages/NewReport";
import Calculations from "./pages/Calculations";
import AddressValidation from "./pages/AddressValidation";
import AICivilEngineer from "./pages/AICivilEngineer";
import Assessment from "./pages/Assessment";
import { Toaster } from "@/components/ui/toaster";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";

function App() {
  const session = useSession();
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [debugMessage, setDebugMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Log debug panel interactions to Supabase
  const logDebugInteraction = async (action: string) => {
    if (!session?.user?.id) {
      console.log('No user ID available for logging');
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_history')
        .insert({
          user_id: session.user.id,
          message: action,
          context: { type: 'debug_panel', action }
        });

      if (error) {
        console.error('Error logging debug interaction:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to log interaction. Please try again.",
        });
      }
    } catch (err) {
      console.error('Failed to log debug interaction:', err);
    }
  };

  const handleMessageSubmit = async (message: string) => {
    console.log("Debug message submitted:", message);
    setDebugMessage(message);
    await logDebugInteraction(`Message submitted: ${message}`);
    toast({
      title: "Message Received",
      description: "Your message has been sent to the AI Civil Engineer",
    });
  };

  const handleRetry = async () => {
    console.log("Retrying last action");
    await logDebugInteraction('Retry requested');
    // Add your retry logic here
  };

  useEffect(() => {
    if (isDebugOpen) {
      logDebugInteraction('Debug panel opened');
    }
  }, [isDebugOpen]);

  console.log("Debug panel state:", { isDebugOpen });

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/new-report" element={<NewReport />} />
          <Route path="/calculations" element={<Calculations />} />
          <Route path="/address-validation" element={<AddressValidation />} />
          <Route path="/ai-civil-engineer" element={<AICivilEngineer />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/parcel-details" element={<Navigate to="/ai-civil-engineer" replace />} />
        </Routes>

        {/* Global Debug Panel */}
        <DebugPanel
          isOpen={isDebugOpen}
          isLoading={isLoading}
          error={error}
          requestId={null}
          lightboxData={null}
          apiCallHistory={[]}
          apiError={null}
          onRetry={handleRetry}
          onMessageSubmit={handleMessageSubmit}
        />

        {/* Floating Action Button */}
        <Button
          onClick={() => {
            console.log("Debug button clicked, toggling state");
            setIsDebugOpen(!isDebugOpen);
            toast({
              title: isDebugOpen ? "AI Civil Engineer Closed" : "AI Civil Engineer Ready",
              description: isDebugOpen ? 
                "Debug panel has been closed" : 
                "Ask me anything about civil engineering!",
            });
          }}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white p-0 z-50 transition-transform hover:scale-105 active:scale-95"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        <Toaster />
      </Router>
    </SessionContextProvider>
  );
}

export default App;