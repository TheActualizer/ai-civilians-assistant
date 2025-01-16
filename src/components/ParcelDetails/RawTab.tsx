import { Database, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface RawTabProps {
  lightboxData: LightBoxResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

export function RawTab({ lightboxData, isLoading, error }: RawTabProps) {
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
          <Skeleton className="h-[400px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (!lightboxData?.rawResponse) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-400 text-center">No raw data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle>Raw API Response</CardTitle>
        </div>
        <CardDescription>Complete unmodified response from LightBox API</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <pre className="p-4 text-sm font-mono">
            {JSON.stringify(lightboxData.rawResponse, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}