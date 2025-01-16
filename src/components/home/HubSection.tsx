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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <Button
        onClick={() => navigate(routes[0].path)}
        variant="outline"
        className="w-full justify-start text-left h-auto p-4"
      >
        <Icon className="mr-2 h-5 w-5" />
        {routes[0].label}
      </Button>
      {routes.slice(1).map((route) => (
        <Button
          key={route.path}
          onClick={() => navigate(route.path)}
          variant="outline"
          className="w-full justify-start text-left h-auto p-4"
        >
          {route.icon ? (
            <route.icon className="mr-2 h-5 w-5" />
          ) : (
            <ChevronRight className="mr-2 h-5 w-5" />
          )}
          {route.label}
        </Button>
      ))}
    </div>
  );
};