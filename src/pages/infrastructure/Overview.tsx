import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { testSystemLogs } from "@/utils/logTesting";
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

export default function InfrastructureOverview() {
  const { toast } = useToast();

  const handleTestLogs = async () => {
    console.log('🚀 Initiating log testing...');
    
    const result = await testSystemLogs();
    
    if (result.success) {
      toast({
        title: "Log Tests Completed",
        description: "All logging systems are functioning correctly",
        icon: <CheckCircle className="h-4 w-4 text-green-400" />
      });
    } else {
      toast({
        variant: "destructive",
        title: "Log Test Failed",
        description: "Check console for detailed error information",
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  };

  useEffect(() => {
    console.log('📊 Infrastructure Overview mounted');
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">Infrastructure Overview</h1>
      </div>

      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle className="text-gray-100">System Logging Tests</CardTitle>
            </div>
            <Button 
              onClick={handleTestLogs}
              className="bg-primary hover:bg-primary/90"
            >
              Run Log Tests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-400">
            Click the button above to test the system logging infrastructure. 
            Results will be displayed in the console and via toast notifications.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}