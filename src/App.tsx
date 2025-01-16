import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ToolbarStyleProvider } from "./contexts/ToolbarStyleContext";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Eagerly load critical pages
import Index from "./pages/Index";
import Login from "./pages/Login";

// Group lazy-loaded routes by domain
const EnterprisePages = {
  Enterprise: lazy(() => import("./pages/Enterprise")),
  Analytics: lazy(() => import("./pages/Analytics")),
  ProjectManagement: lazy(() => import("./pages/ProjectManagement")),
  ResourceAllocation: lazy(() => import("./pages/ResourceAllocation")),
  ComplianceHub: lazy(() => import("./pages/ComplianceHub")),
  StrategicPlanning: lazy(() => import("./pages/StrategicPlanning"))
};

const InfrastructurePages = {
  DataCenter: lazy(() => import("./pages/DataCenter")),
  SecurityOperations: lazy(() => import("./pages/SecurityOperations")),
  NetworkInfrastructure: lazy(() => import("./pages/NetworkInfrastructure")),
  CloudServices: lazy(() => import("./pages/CloudServices"))
};

const TechnologyPages = {
  APIGateway: lazy(() => import("./pages/APIGateway")),
  MachineLearning: lazy(() => import("./pages/MachineLearning")),
  DevOps: lazy(() => import("./pages/DevOps")),
  Automation: lazy(() => import("./pages/Automation"))
};

const BusinessPages = {
  BusinessIntelligence: lazy(() => import("./pages/BusinessIntelligence")),
  CustomerSuccess: lazy(() => import("./pages/CustomerSuccess")),
  FinancialServices: lazy(() => import("./pages/FinancialServices")),
  HumanResources: lazy(() => import("./pages/HumanResources"))
};

const InnovationPages = {
  SupplyChain: lazy(() => import("./pages/SupplyChain")),
  QualityAssurance: lazy(() => import("./pages/QualityAssurance")),
  Research: lazy(() => import("./pages/Research")),
  Innovation: lazy(() => import("./pages/Innovation"))
};

const CorePages = {
  GetStarted: lazy(() => import("./pages/GetStarted")),
  LearnMore: lazy(() => import("./pages/LearnMore")),
  Solutions: lazy(() => import("./pages/Solutions")),
  Marketplace: lazy(() => import("./pages/Marketplace")),
  Orders: lazy(() => import("./pages/Orders")),
  NewReport: lazy(() => import("./pages/NewReport")),
  Calculations: lazy(() => import("./pages/Calculations")),
  AddressValidation: lazy(() => import("./pages/AddressValidation")),
  AICivilEngineer: lazy(() => import("./pages/AICivilEngineer")),
  Assessment: lazy(() => import("./pages/Assessment")),
  AgentMonitoring: lazy(() => import("./pages/AgentMonitoring"))
};

// Enhanced loading component with progress
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
    <div className="w-32 h-32 relative">
      <div className="absolute inset-0 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-r-2 border-l-2 border-primary/50 rounded-full animate-spin-slow"></div>
    </div>
    <p className="mt-4 text-gray-400 animate-pulse">Loading experience...</p>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-8">
    <div className="max-w-md w-full space-y-4 text-center">
      <h2 className="text-2xl font-bold text-red-400">Something went wrong</h2>
      <pre className="text-sm text-gray-400 bg-gray-800/50 p-4 rounded-lg overflow-auto">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ToolbarStyleProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Core routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Enterprise routes */}
                <Route path="/enterprise" element={<EnterprisePages.Enterprise />} />
                <Route path="/analytics" element={<EnterprisePages.Analytics />} />
                <Route path="/project-management" element={<EnterprisePages.ProjectManagement />} />
                <Route path="/resource-allocation" element={<EnterprisePages.ResourceAllocation />} />
                <Route path="/compliance-hub" element={<EnterprisePages.ComplianceHub />} />
                <Route path="/strategic-planning" element={<EnterprisePages.StrategicPlanning />} />

                {/* Infrastructure routes */}
                <Route path="/data-center" element={<InfrastructurePages.DataCenter />} />
                <Route path="/security-operations" element={<InfrastructurePages.SecurityOperations />} />
                <Route path="/network-infrastructure" element={<InfrastructurePages.NetworkInfrastructure />} />
                <Route path="/cloud-services" element={<InfrastructurePages.CloudServices />} />

                {/* Technology routes */}
                <Route path="/api-gateway" element={<TechnologyPages.APIGateway />} />
                <Route path="/machine-learning" element={<TechnologyPages.MachineLearning />} />
                <Route path="/devops" element={<TechnologyPages.DevOps />} />
                <Route path="/automation" element={<TechnologyPages.Automation />} />

                {/* Business routes */}
                <Route path="/business-intelligence" element={<BusinessPages.BusinessIntelligence />} />
                <Route path="/customer-success" element={<BusinessPages.CustomerSuccess />} />
                <Route path="/financial-services" element={<BusinessPages.FinancialServices />} />
                <Route path="/human-resources" element={<BusinessPages.HumanResources />} />

                {/* Innovation routes */}
                <Route path="/supply-chain" element={<InnovationPages.SupplyChain />} />
                <Route path="/quality-assurance" element={<InnovationPages.QualityAssurance />} />
                <Route path="/research" element={<InnovationPages.Research />} />
                <Route path="/innovation" element={<InnovationPages.Innovation />} />

                {/* Core feature routes */}
                <Route path="/get-started" element={<CorePages.GetStarted />} />
                <Route path="/learn-more" element={<CorePages.LearnMore />} />
                <Route path="/solutions" element={<CorePages.Solutions />} />
                <Route path="/marketplace" element={<CorePages.Marketplace />} />
                <Route path="/orders" element={<CorePages.Orders />} />
                <Route path="/new-report" element={<CorePages.NewReport />} />
                <Route path="/calculations" element={<CorePages.Calculations />} />
                <Route path="/address-validation" element={<CorePages.AddressValidation />} />
                <Route path="/ai-civil-engineer" element={<CorePages.AICivilEngineer />} />
                <Route path="/assessment" element={<CorePages.Assessment />} />
                <Route path="/agent-monitoring" element={<CorePages.AgentMonitoring />} />

                {/* Legacy route redirect */}
                <Route path="/parcel-details" element={<Navigate to="/ai-civil-engineer" replace />} />
              </Routes>
            </Suspense>
            <Toaster />
          </Router>
        </ErrorBoundary>
      </ToolbarStyleProvider>
    </SessionContextProvider>
  );
}

export default App;