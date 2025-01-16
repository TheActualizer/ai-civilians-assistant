import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ToolbarStyleProvider } from "./contexts/ToolbarStyleContext";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { DynamicPage } from "./components/DynamicPage/DynamicPage";

// Preserve direct imports for critical pages
import LearnMore from "./pages/LearnMore";
import AICivilEngineer from "./pages/AICivilEngineer";
import AreaCalculations from "./pages/AreaCalculations";

// Legacy Pages
import LegacyParcelAnalysis from "./pages/legacy/ParcelAnalysis";
import LegacyPropertyDetails from "./pages/legacy/PropertyDetails";
import LegacyAssessmentView from "./pages/legacy/AssessmentView";

// Lazy loaded pages
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

// Enterprise Hub
const EnterpriseOverview = lazy(() => import("./pages/enterprise/Overview"));
const ResourcePlanning = lazy(() => import("./pages/enterprise/ResourcePlanning"));
const Analytics = lazy(() => import("./pages/enterprise/Analytics"));

// Infrastructure Hub
const InfrastructureOverview = lazy(() => import("./pages/infrastructure/Overview"));
const NetworkManagement = lazy(() => import("./pages/infrastructure/NetworkManagement"));
const SecurityMonitoring = lazy(() => import("./pages/infrastructure/SecurityMonitoring"));

// Technology Hub
const TechnologyOverview = lazy(() => import("./pages/technology/Overview"));
const Innovation = lazy(() => import("./pages/technology/Innovation"));
const Research = lazy(() => import("./pages/technology/Research"));

// Business Operations Hub
const OperationsOverview = lazy(() => import("./pages/operations/Overview"));
const Workflow = lazy(() => import("./pages/operations/Workflow"));
const Reporting = lazy(() => import("./pages/operations/Reporting"));

// Innovation Center Hub
const InnovationOverview = lazy(() => import("./pages/innovation/Overview"));
const LabProjects = lazy(() => import("./pages/innovation/LabProjects"));
const Experiments = lazy(() => import("./pages/innovation/Experiments"));

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ToolbarStyleProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Core Routes - Not Lazy Loaded */}
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/ai-civil-engineer" element={<AICivilEngineer />} />
              <Route path="/area-calculations" element={<AreaCalculations />} />
              
              {/* Legacy Routes */}
              <Route path="/legacy/parcel-analysis" element={<LegacyParcelAnalysis />} />
              <Route path="/legacy/property-details" element={<LegacyPropertyDetails />} />
              <Route path="/legacy/assessment-view" element={<LegacyAssessmentView />} />
              
              {/* Dynamic Hub Routes */}
              <Route path="/:hubName">
                <Route index element={<DynamicPage />} />
                <Route path=":pagePath" element={<DynamicPage />} />
              </Route>

              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/new-report" element={<NewReport />} />
              <Route path="/calculations" element={<Calculations />} />
              <Route path="/address-validation" element={<AddressValidation />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/agent-monitoring" element={<AgentMonitoring />} />

              {/* Enterprise Hub */}
              <Route path="/enterprise">
                <Route index element={<EnterpriseOverview />} />
                <Route path="planning" element={<ResourcePlanning />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>

              {/* Infrastructure Hub */}
              <Route path="/infrastructure">
                <Route index element={<InfrastructureOverview />} />
                <Route path="network" element={<NetworkManagement />} />
                <Route path="security" element={<SecurityMonitoring />} />
              </Route>

              {/* Technology Hub */}
              <Route path="/technology">
                <Route index element={<TechnologyOverview />} />
                <Route path="innovation" element={<Innovation />} />
                <Route path="research" element={<Research />} />
              </Route>

              {/* Business Operations Hub */}
              <Route path="/operations">
                <Route index element={<OperationsOverview />} />
                <Route path="workflow" element={<Workflow />} />
                <Route path="reporting" element={<Reporting />} />
              </Route>

              {/* Innovation Center Hub */}
              <Route path="/innovation">
                <Route index element={<InnovationOverview />} />
                <Route path="lab" element={<LabProjects />} />
                <Route path="experiments" element={<Experiments />} />
              </Route>

              {/* Legacy Route Redirect */}
              <Route path="/parcel-details" element={<Navigate to="/ai-civil-engineer" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </Router>
      </ToolbarStyleProvider>
    </SessionContextProvider>
  );
}

export default App;