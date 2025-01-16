import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface AdditionalTabProps {
  lightboxData: LightBoxResponse | null;
}

export function AdditionalTab({ lightboxData }: AdditionalTabProps) {
  if (!lightboxData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No additional details available</p>
      </div>
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
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Processing Status</h3>
              <Badge className="mt-2" variant={lightboxData.lightbox_processed ? "default" : "secondary"}>
                {lightboxData.lightbox_processed ? "Processed" : "Pending"}
              </Badge>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Processing Time</h3>
              <p className="mt-1">
                {lightboxData.processed_at 
                  ? new Date(lightboxData.processed_at).toLocaleString()
                  : 'Not processed yet'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}