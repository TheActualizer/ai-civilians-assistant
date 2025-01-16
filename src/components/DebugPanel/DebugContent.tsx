import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { ApiCallHistoryEntry, ApiError } from "./types";

interface DebugContentProps {
  activeViews: string[];
  viewMode: "detailed" | "compact";
  apiError: ApiError | null;
  error: string | null;
  apiCallHistory: ApiCallHistoryEntry[];
}

export const DebugContent = ({
  activeViews,
  viewMode,
  apiError,
  error,
  apiCallHistory
}: DebugContentProps) => {
  return (
    <div className="space-y-4">
      {activeViews.includes('error') && (apiError || error) && (
        <Card className="bg-red-900/20 border-red-800/50 transition-colors hover:bg-red-900/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <CardTitle className="text-red-300">
                {apiError ? 'API Error' : 'Error'}
              </CardTitle>
              <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-700">
                {new Date(apiError?.timestamp || Date.now()).toLocaleTimeString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-300">{apiError?.message || error}</p>
            {apiError?.details && viewMode === "detailed" && (
              <ScrollArea className="h-[100px] mt-2 rounded-md border border-red-800/30 bg-red-900/10 p-4">
                <pre className="text-sm font-mono text-red-300">
                  {JSON.stringify(apiError.details, null, 2)}
                </pre>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {activeViews.includes('history') && apiCallHistory.length > 0 && (
        <Card className="bg-gray-800/40 border-gray-700 transition-colors hover:bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">API Call History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {apiCallHistory.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`border-l-2 pl-4 py-2 transition-colors ${
                      entry.event.includes('Error') 
                        ? 'border-red-500 bg-red-900/20 hover:bg-red-900/30' 
                        : 'border-primary bg-gray-800/40 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={entry.event.includes('Error') 
                          ? 'bg-red-900/30 border-red-700' 
                          : 'bg-primary/10 border-primary/50'
                        }
                      >
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </Badge>
                      <span className={`font-medium ${
                        entry.event.includes('Error') 
                          ? 'text-red-300' 
                          : 'text-gray-300'
                      }`}>
                        {entry.event}
                      </span>
                    </div>
                    {entry.details && viewMode === "detailed" && (
                      <pre className={`mt-2 text-sm p-2 rounded-md font-mono ${
                        entry.event.includes('Error') 
                          ? 'bg-red-900/10 text-red-300' 
                          : 'bg-gray-800/60 text-gray-300'
                      }`}>
                        {JSON.stringify(entry.details, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};