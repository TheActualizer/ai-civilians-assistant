import { Building2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface PropertyTabProps {
  lightboxData: LightBoxResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

export function PropertyTab({ lightboxData, isLoading, error }: PropertyTabProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 p-4 rounded-lg">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lightboxData?.propertyDetails || Object.keys(lightboxData.propertyDetails).length === 0) {
    return (
      <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-center">No property details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-gray-100">Property Analysis</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Comprehensive property details from LightBox
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(lightboxData.propertyDetails).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-primary/50 transition-colors"
              >
                <h3 className="text-sm font-medium text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <p className="mt-1 text-lg text-gray-100">
                  {value || "Not available"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}