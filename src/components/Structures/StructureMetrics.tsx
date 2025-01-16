import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Scale, Ruler, MapPin } from "lucide-react";

export function StructureMetrics() {
  const metrics = [
    { icon: Building2, label: "Total Structures", value: "12" },
    { icon: Scale, label: "Average Height", value: "45 ft" },
    { icon: Ruler, label: "Total Area", value: "25,000 sq ft" },
    { icon: MapPin, label: "Zoning Type", value: "R-2" },
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">Structure Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors"
              >
                <Icon className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-gray-400">{metric.label}</p>
                <p className="text-xl font-bold text-gray-100">{metric.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}