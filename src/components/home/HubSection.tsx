import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon, ChevronRight } from "lucide-react";

interface HubSectionProps {
  title: string;
  icon: LucideIcon;
  routes: {
    path: string;
    label: string;
    icon?: LucideIcon;
  }[];
}

export const HubSection = ({ title, icon: Icon, routes }: HubSectionProps) => {
  const navigate = useNavigate();

  if (!routes || !Array.isArray(routes)) {
    console.error('Routes is undefined or not an array in HubSection');
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
        <Icon className="h-6 w-6 mr-2 text-primary" />
        {title}
      </h2>
      {routes.map((route) => (
        <Button
          key={route.path}
          onClick={() => navigate(route.path)}
          variant="outline"
          className="w-full justify-between text-left h-auto p-4 hover:bg-gray-800 hover:border-primary transition-colors"
        >
          <span className="flex items-center">
            {route.icon && <route.icon className="mr-2 h-5 w-5 text-gray-400" />}
            {route.label}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Button>
      ))}
    </div>
  );
};