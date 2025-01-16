import { MapPin, AlertCircle, ToggleRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface AddressTabProps {
  lightboxData: LightBoxResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

export function AddressTab({ lightboxData, isLoading, error }: AddressTabProps) {
  const [showDetails, setShowDetails] = useState(false);

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

  if (!lightboxData?.address) {
    return (
      <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-center">No address details available</p>
        </CardContent>
      </Card>
    );
  }

  const addressFields = [
    { label: "Street Address", value: lightboxData.address.streetAddress },
    { label: "City", value: lightboxData.address.city },
    { label: "State", value: lightboxData.address.state },
    { label: "ZIP Code", value: lightboxData.address.zip },
  ];

  const detailedFields = [
    { label: "County", value: lightboxData.address.county },
    { label: "Country", value: "United States" },
    { 
      label: "Coordinates", 
      value: lightboxData.coordinates 
        ? `${lightboxData.coordinates.lat}, ${lightboxData.coordinates.lng}`
        : undefined 
    },
  ];

  return (
    <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-gray-100">Address Details</CardTitle>
          </div>
          <Toggle
            aria-label="Toggle address details"
            pressed={showDetails}
            onPressedChange={setShowDetails}
            className="data-[state=on]:bg-primary"
          >
            <ToggleRight className="h-4 w-4" />
            <span className="ml-2 text-sm">Details</span>
          </Toggle>
        </div>
        <CardDescription className="text-gray-400">
          {showDetails ? "Showing detailed address information" : "Showing basic address information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addressFields.map((field) => (
              <div
                key={field.label}
                className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-primary/50 transition-colors group"
              >
                <h3 className="text-sm font-medium text-gray-400 group-hover:text-primary/80 transition-colors">
                  {field.label}
                </h3>
                <p className="mt-1 text-lg text-gray-100 font-medium">
                  {field.value || "Not available"}
                </p>
              </div>
            ))}
          </div>
          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
              {detailedFields.map((field) => (
                <div
                  key={field.label}
                  className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-primary/50 transition-colors group"
                >
                  <h3 className="text-sm font-medium text-gray-400 group-hover:text-primary/80 transition-colors">
                    {field.label}
                  </h3>
                  <p className="mt-1 text-lg text-gray-100 font-medium">
                    {field.value || "Not available"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}