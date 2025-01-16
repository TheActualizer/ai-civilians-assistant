import { Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface PropertyTabProps {
  lightboxData: LightBoxResponse | null;
}

export function PropertyTab({ lightboxData }: PropertyTabProps) {
  if (!lightboxData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No property details available</p>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-gray-100">Property Analysis</CardTitle>
        </div>
        <CardDescription className="text-gray-400">Comprehensive property details from LightBox</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lightboxData.propertyDetails && Object.entries(lightboxData.propertyDetails).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="mt-1 text-lg">{value || 'Not available'}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}