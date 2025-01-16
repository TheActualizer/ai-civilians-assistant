import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface ParsedTabProps {
  lightboxData: LightBoxResponse | null;
}

export function ParsedTab({ lightboxData }: ParsedTabProps) {
  if (!lightboxData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No parsed data available</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Parsed LightBox Data</CardTitle>
        </div>
        <CardDescription>Structured data from LightBox API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500">Parcel ID</h4>
                <p className="mt-1">{lightboxData?.parcelId || 'Not available'}</p>
              </div>
              {lightboxData?.propertyDetails && Object.entries(lightboxData.propertyDetails).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="mt-1">{value || 'Not available'}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Processing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500">Processing Status</h4>
                <Badge className="mt-2" variant={lightboxData?.lightbox_processed ? "default" : "secondary"}>
                  {lightboxData?.lightbox_processed ? "Processed" : "Pending"}
                </Badge>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500">Processing Time</h4>
                <p className="mt-1">
                  {lightboxData?.processed_at 
                    ? new Date(lightboxData.processed_at).toLocaleString()
                    : 'Not processed yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}