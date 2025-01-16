import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ToolbarStyleProvider } from "./contexts/ToolbarStyleContext";
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
import AgentMonitoring from "./pages/AgentMonitoring";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ToolbarStyleProvider>
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
            <Route path="/agent-monitoring" element={<AgentMonitoring />} />
            <Route path="/parcel-details" element={<Navigate to="/ai-civil-engineer" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </ToolbarStyleProvider>
    </SessionContextProvider>
  );
}

export default App;