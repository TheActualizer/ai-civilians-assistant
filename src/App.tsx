import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ToolbarStyleProvider } from "./contexts/ToolbarStyleContext";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";

// Lazy load all other pages
const GetStarted = lazy(() => import("./pages/GetStarted"));
const LearnMore = lazy(() => import("./pages/LearnMore"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Orders = lazy(() => import("./pages/Orders"));
const NewReport = lazy(() => import("./pages/NewReport"));
const Calculations = lazy(() => import("./pages/Calculations"));
const AddressValidation = lazy(() => import("./pages/AddressValidation"));
const AICivilEngineer = lazy(() => import("./pages/AICivilEngineer"));
const Assessment = lazy(() => import("./pages/Assessment"));
const AgentMonitoring = lazy(() => import("./pages/AgentMonitoring"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const Analytics = lazy(() => import("./pages/Analytics"));
const ProjectManagement = lazy(() => import("./pages/ProjectManagement"));
const ResourceAllocation = lazy(() => import("./pages/ResourceAllocation"));
const ComplianceHub = lazy(() => import("./pages/ComplianceHub"));
const StrategicPlanning = lazy(() => import("./pages/StrategicPlanning"));
const DataCenter = lazy(() => import("./pages/DataCenter"));
const SecurityOperations = lazy(() => import("./pages/SecurityOperations"));
const NetworkInfrastructure = lazy(() => import("./pages/NetworkInfrastructure"));
const CloudServices = lazy(() => import("./pages/CloudServices"));
const APIGateway = lazy(() => import("./pages/APIGateway"));
const MachineLearning = lazy(() => import("./pages/MachineLearning"));
const DevOps = lazy(() => import("./pages/DevOps"));
const Automation = lazy(() => import("./pages/Automation"));
const BusinessIntelligence = lazy(() => import("./pages/BusinessIntelligence"));
const CustomerSuccess = lazy(() => import("./pages/CustomerSuccess"));
const FinancialServices = lazy(() => import("./pages/FinancialServices"));
const HumanResources = lazy(() => import("./pages/HumanResources"));
const SupplyChain = lazy(() => import("./pages/SupplyChain"));
const QualityAssurance = lazy(() => import("./pages/QualityAssurance"));
const Research = lazy(() => import("./pages/Research"));
const Innovation = lazy(() => import("./pages/Innovation"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ToolbarStyleProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/project-management" element={<ProjectManagement />} />
              <Route path="/resource-allocation" element={<ResourceAllocation />} />
              <Route path="/compliance-hub" element={<ComplianceHub />} />
              <Route path="/strategic-planning" element={<StrategicPlanning />} />
              <Route path="/data-center" element={<DataCenter />} />
              <Route path="/security-operations" element={<SecurityOperations />} />
              <Route path="/network-infrastructure" element={<NetworkInfrastructure />} />
              <Route path="/cloud-services" element={<CloudServices />} />
              <Route path="/api-gateway" element={<APIGateway />} />
              <Route path="/machine-learning" element={<MachineLearning />} />
              <Route path="/devops" element={<DevOps />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/business-intelligence" element={<BusinessIntelligence />} />
              <Route path="/customer-success" element={<CustomerSuccess />} />
              <Route path="/financial-services" element={<FinancialServices />} />
              <Route path="/human-resources" element={<HumanResources />} />
              <Route path="/supply-chain" element={<SupplyChain />} />
              <Route path="/quality-assurance" element={<QualityAssurance />} />
              <Route path="/research" element={<Research />} />
              <Route path="/innovation" element={<Innovation />} />
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