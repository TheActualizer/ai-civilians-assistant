import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, AlertCircle } from "lucide-react";
import { testScenarios } from "@/utils/agentTestScenarios";

export function TestControls() {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          Test Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {testScenarios.map((scenario, index) => (
              <div 
                key={index}
                className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-200">{scenario.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scenario.run()}
                    className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/50"
                  >
                    Run Test
                  </Button>
                </div>
                <p className="text-sm text-gray-400">{scenario.description}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}