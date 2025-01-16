import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface AddressTabProps {
  lightboxData: LightBoxResponse | null;
}

export function AddressTab({ lightboxData }: AddressTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <CardTitle>Address Details</CardTitle>
        </div>
        <CardDescription>Verified address information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Street Address</h3>
              <p className="mt-1 text-lg">{lightboxData?.address?.streetAddress || 'Not available'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">City</h3>
              <p className="mt-1 text-lg">{lightboxData?.address?.city || 'Not available'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">State</h3>
              <p className="mt-1 text-lg">{lightboxData?.address?.state || 'Not available'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">ZIP Code</h3>
              <p className="mt-1 text-lg">{lightboxData?.address?.zip || 'Not available'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}