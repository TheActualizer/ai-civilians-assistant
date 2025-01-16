import { Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface AdditionalTabProps {
  lightboxData: LightBoxResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

export function AdditionalTab({ lightboxData, isLoading, error }: AdditionalTabProps) {
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lightboxData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-center">No additional details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle>Additional Property Information</CardTitle>
        </div>
        <CardDescription>Extended property details from LightBox API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-primary/50 transition-colors">
              <h3 className="text-sm font-medium text-gray-500">Processing Status</h3>
              <Badge
                className="mt-2"
                variant={lightboxData.lightbox_processed ? "default" : "secondary"}
              >
                {lightboxData.lightbox_processed ? "Processed" : "Pending"}
              </Badge>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-primary/50 transition-colors">
              <h3 className="text-sm font-medium text-gray-500">Processing Time</h3>
              <p className="mt-1">
                {lightboxData.processed_at
                  ? new Date(lightboxData.processed_at).toLocaleString()
                  : "Not processed yet"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}