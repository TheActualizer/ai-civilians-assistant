import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, LayoutGrid, MapPin, UserCheck, FileText, FileBarChart, ShoppingCart, ChevronRight } from "lucide-react";

export const CoreFeatures = () => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        {
          path: "/calculations",
          label: "Calculations",
          icon: Calculator,
          color: "text-blue-600"
        },
        {
          path: "/area-calculations",
          label: "Area Calculations",
          icon: LayoutGrid,
          color: "text-green-600"
        },
        {
          path: "/address-validation",
          label: "Address Validation",
          icon: MapPin,
          color: "text-red-600"
        },
        {
          path: "/agent-monitoring",
          label: "Agent Monitoring",
          icon: UserCheck,
          color: "text-purple-600"
        },
        {
          path: "/new-report",
          label: "New Report",
          icon: FileText,
          color: "text-orange-600"
        },
        {
          path: "/assessment",
          label: "Assessment",
          icon: FileBarChart,
          color: "text-indigo-600"
        },
        {
          path: "/marketplace",
          label: "Marketplace",
          icon: ShoppingCart,
          color: "text-teal-600"
        }
      ].map((feature) => (
        <Button
          key={feature.path}
          onClick={() => navigate(feature.path)}
          variant="outline"
          className="h-auto p-4 flex items-center justify-between hover:bg-gray-50 hover:border-primary transition-colors bg-white shadow-sm hover:shadow-md"
        >
          <div className="flex items-center">
            <feature.icon className={`h-5 w-5 mr-2 ${feature.color}`} />
            <span className="font-medium">{feature.label}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Button>
      ))}
    </div>
  );
};