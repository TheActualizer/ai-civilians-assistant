import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ToolbarStyleProvider } from "./contexts/ToolbarStyleContext";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { DynamicPage } from "./components/DynamicPage/DynamicPage";
import Navbar from "./components/Navbar";
import { NavigationControls } from "./components/navigation/NavigationControls";
import { DebugPanel } from "./components/DebugPanel/DebugPanel";

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

// Enterprise Hub
const EnterpriseOverview = lazy(() => import("./pages/enterprise/Overview"));
const ResourcePlanning = lazy(() => import("./pages/enterprise/ResourcePlanning"));
const Analytics = lazy(() => import("./pages/enterprise/Analytics"));
const SystemAnalytics = lazy(() => import("./pages/enterprise/SystemAnalytics"));
const ThreadAnalysis = lazy(() => import("./pages/enterprise/ThreadAnalysis"));
const AgentMetrics = lazy(() => import("./pages/enterprise/AgentMetrics"));

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
          <div className="min-h-screen flex flex-col">
            <Navbar session={null} />
            <NavigationControls />
            <DebugPanel
              isLoading={false}
              error={null}
              requestId={null}
              lightboxData={null}
              apiCallHistory={[]}
              apiError={null}
              onRetry={() => {}}
              onMessageSubmit={() => {}}
            />
            <main className="flex-1 pt-20">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
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
                  <Route path="/legacy/*" element={
                    <Routes>
                      <Route path="parcel-analysis" element={lazyLoad(() => import("./pages/legacy/ParcelAnalysis"))} />
                      <Route path="property-details" element={lazyLoad(() => import("./pages/legacy/PropertyDetails"))} />
                      <Route path="assessment-view" element={lazyLoad(() => import("./pages/legacy/AssessmentView"))} />
                      <Route path="agent-dashboard" element={lazyLoad(() => import("./pages/legacy/AgentDashboard"))} />
                      <Route path="debug-console" element={lazyLoad(() => import("./pages/legacy/DebugConsole"))} />
                      <Route path="system-intelligence" element={lazyLoad(() => import("./pages/legacy/SystemIntelligence"))} />
                      <Route path="shared-computer" element={lazyLoad(() => import("./pages/legacy/SharedComputer"))} />
                    </Routes>
                  } />

                  {/* Dynamic Hub Routes */}
                  <Route path="/:hubName">
                    <Route index element={<DynamicPage />} />
                    <Route path=":pagePath" element={<DynamicPage />} />
                  </Route>

                  {/* Hub Routes */}
                  {[
                    {
                      path: "enterprise",
                      routes: [
                        { index: true, component: EnterpriseOverview },
                        { path: "planning", component: ResourcePlanning },
                        { path: "analytics", component: Analytics },
                        { path: "system-analytics", component: SystemAnalytics },
                        { path: "thread-analysis", component: ThreadAnalysis },
                        { path: "agent-metrics", component: AgentMetrics }
                      ]
                    },
                    {
                      path: "infrastructure",
                      routes: [
                        { index: true, component: InfrastructureOverview },
                        { path: "network", component: NetworkManagement },
                        { path: "security", component: SecurityMonitoring }
                      ]
                    },
                    {
                      path: "technology",
                      routes: [
                        { index: true, component: TechnologyOverview },
                        { path: "innovation", component: Innovation },
                        { path: "research", component: Research }
                      ]
                    },
                    {
                      path: "operations",
                      routes: [
                        { index: true, component: OperationsOverview },
                        { path: "workflow", component: Workflow },
                        { path: "reporting", component: Reporting }
                      ]
                    },
                    {
                      path: "innovation",
                      routes: [
                        { index: true, component: InnovationOverview },
                        { path: "lab", component: LabProjects },
                        { path: "experiments", component: Experiments }
                      ]
                    }
                  ].map(hub => (
                    <Route key={hub.path} path={hub.path}>
                      {hub.routes.map(route => (
                        <Route
                          key={route.path || 'index'}
                          index={route.index}
                          path={route.path}
                          element={<Suspense fallback={<LoadingSpinner />}><route.component /></Suspense>}
                        />
                      ))}
                    </Route>
                  ))}

                  {/* Legacy Route Redirect */}
                  <Route path="/parcel-details" element={<Navigate to="/ai-civil-engineer" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Toaster />
          </div>
        </Router>
      </ToolbarStyleProvider>
    </SessionContextProvider>
  );
}

export default App;
