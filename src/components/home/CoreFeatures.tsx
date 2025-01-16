import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, LayoutGrid, MapPin, UserCheck, FileText, FileBarChart, ShoppingCart } from "lucide-react";

export const CoreFeatures = () => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Button
        onClick={() => navigate("/calculations")}
        variant="outline"
        className="h-auto p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          <span>Calculations</span>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/area-calculations")}
        variant="outline"
        className="h-auto p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <LayoutGrid className="h-5 w-5 mr-2" />
          <span>Area Calculations</span>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/address-validation")}
        variant="outline"
        className="h-auto p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          <span>Address Validation</span>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/agent-monitoring")}
        variant="outline"
        className="h-auto p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          <span>Agent Monitoring</span>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/new-report")}
        variant="outline"
        className="h-auto p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          <span>New Report</span>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/assessment")}
        variant="outline"
        className="h-auto p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <FileBarChart className="h-5 w-5 mr-2" />
          <span>Assessment</span>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/marketplace")}
        variant="outline"
        className="h-auto p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span>Marketplace</span>
        </div>
      </Button>
    </div>
  );
};