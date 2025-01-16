import { Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LightBoxResponse } from "@/components/GetStarted/types";

interface RawTabProps {
  lightboxData: LightBoxResponse | null;
}

export function RawTab({ lightboxData }: RawTabProps) {
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
          <pre className="p-4 text-sm">
            {JSON.stringify(lightboxData?.rawResponse || {}, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}