import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiCallHistoryEntry } from "@/components/GetStarted/types";

interface DebugHistoryProps {
  history: ApiCallHistoryEntry[];
  viewMode: "detailed" | "compact";
}

export const DebugHistory = ({ history, viewMode }: DebugHistoryProps) => {
  return (
    <Card className="bg-gray-800/40 border-gray-700 transition-colors hover:bg-gray-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">API Call History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {history.map((entry, index) => (
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
  );
};