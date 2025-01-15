import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Orders from "@/pages/Orders";
import Settings from "@/pages/Settings";
import Solutions from "@/pages/Solutions";
import LearnMore from "@/pages/LearnMore";
import GetStarted from "@/pages/GetStarted";
import Marketplace from "@/pages/Marketplace";
import NewReport from "@/pages/NewReport";
import ProtectedRoute from "@/components/ProtectedRoute";

import "./App.css";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar session={session} setSession={setSession} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login setSession={setSession} />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute session={session}>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute session={session}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute session={session}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-report"
            element={
              <ProtectedRoute session={session}>
                <NewReport />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;