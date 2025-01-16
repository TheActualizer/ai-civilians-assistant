import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ToolbarStyleProvider } from "./contexts/ToolbarStyleContext";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { DynamicPage } from "./components/DynamicPage/DynamicPage";
import { NavigationControls } from "./components/navigation/NavigationControls";
import { DebugPanel } from "./components/DebugPanel/DebugPanel";
import { MainLayout } from "./components/layouts/MainLayout";

// Lazy load all pages with loading boundaries
const lazyLoad = (importFn: () => Promise<any>) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
};

// Core Routes
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Orders = lazy(() => import("./pages/Orders"));
const NewReport = lazy(() => import("./pages/NewReport"));
const Calculations = lazy(() => import("./pages/Calculations"));
const AddressValidation = lazy(() => import("./pages/AddressValidation"));
const Assessment = lazy(() => import("./pages/Assessment"));
const AgentMonitoring = lazy(() => import("./pages/AgentMonitoring"));
const LearnMore = lazy(() => import("./pages/LearnMore"));
const AICivilEngineer = lazy(() => import("./pages/AICivilEngineer"));
const AreaCalculations = lazy(() => import("./pages/AreaCalculations"));
const ZoningAnalysis = lazy(() => import("./pages/ZoningAnalysis"));

// Legacy Pages
const LegacyParcelAnalysis = lazy(() => import("./pages/legacy/ParcelAnalysis"));
const LegacyPropertyDetails = lazy(() => import("./pages/legacy/PropertyDetails"));
const LegacyAssessmentView = lazy(() => import("./pages/legacy/AssessmentView"));
const LegacyAgentDashboard = lazy(() => import("./pages/legacy/AgentDashboard"));
const LegacyDebugConsole = lazy(() => import("./pages/legacy/DebugConsole"));
const LegacySystemIntelligence = lazy(() => import("./pages/legacy/SystemIntelligence"));
const LegacySharedComputer = lazy(() => import("./pages/legacy/SharedComputer"));

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ToolbarStyleProvider>
        <Router>
          <MainLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Core Routes */}
                <Route path="/" element={lazyLoad(() => import("./pages/Index"))} />
                <Route path="/login" element={lazyLoad(() => import("./pages/Login"))} />
                <Route path="/get-started" element={lazyLoad(() => import("./pages/GetStarted"))} />
                <Route path="/solutions" element={lazyLoad(() => import("./pages/Solutions"))} />
                <Route path="/marketplace" element={lazyLoad(() => import("./pages/Marketplace"))} />
                <Route path="/orders" element={lazyLoad(() => import("./pages/Orders"))} />
                <Route path="/new-report" element={lazyLoad(() => import("./pages/NewReport"))} />
                <Route path="/calculations" element={lazyLoad(() => import("./pages/Calculations"))} />
                <Route path="/address-validation" element={lazyLoad(() => import("./pages/AddressValidation"))} />
                <Route path="/assessment" element={lazyLoad(() => import("./pages/Assessment"))} />
                <Route path="/agent-monitoring" element={lazyLoad(() => import("./pages/AgentMonitoring"))} />
                <Route path="/learn-more" element={lazyLoad(() => import("./pages/LearnMore"))} />
                <Route path="/ai-civil-engineer" element={lazyLoad(() => import("./pages/AICivilEngineer"))} />
                <Route path="/area-calculations" element={lazyLoad(() => import("./pages/AreaCalculations"))} />
                <Route path="/zoning-analysis" element={lazyLoad(() => import("./pages/ZoningAnalysis"))} />

                {/* Legacy Routes */}
                <Route path="/legacy/*">
                  <Route path="parcel-analysis" element={lazyLoad(() => import("./pages/legacy/ParcelAnalysis"))} />
                  <Route path="property-details" element={lazyLoad(() => import("./pages/legacy/PropertyDetails"))} />
                  <Route path="assessment-view" element={lazyLoad(() => import("./pages/legacy/AssessmentView"))} />
                  <Route path="agent-dashboard" element={lazyLoad(() => import("./pages/legacy/AgentDashboard"))} />
                  <Route path="debug-console" element={lazyLoad(() => import("./pages/legacy/DebugConsole"))} />
                  <Route path="system-intelligence" element={lazyLoad(() => import("./pages/legacy/SystemIntelligence"))} />
                  <Route path="shared-computer" element={lazyLoad(() => import("./pages/legacy/SharedComputer"))} />
                </Route>

                {/* Dynamic Hub Routes - This will handle all hub pages */}
                <Route path="/:hubName/*" element={<DynamicPage />} />

                {/* Legacy Route Redirect */}
                <Route path="/parcel-details" element={<Navigate to="/ai-civil-engineer" replace />} />
              </Routes>
            </Suspense>
          </MainLayout>
          <Toaster />
        </Router>
      </ToolbarStyleProvider>
    </SessionContextProvider>
  );
}

export default App;