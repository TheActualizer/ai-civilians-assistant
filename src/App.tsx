import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { supabase } from "@/integrations/supabase/client";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";

function App() {
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [debugMessage, setDebugMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMessageSubmit = (message: string) => {
    console.log("Debug message submitted:", message);
    // Add your debug message handling logic here
  };

  const handleRetry = () => {
    console.log("Retrying last action");
    // Add your retry logic here
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File uploaded:", e.target.files?.[0]);
    // Add your file upload logic here
  };

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
          onClick={() => setIsDebugOpen(!isDebugOpen)}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white p-0 z-50"
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