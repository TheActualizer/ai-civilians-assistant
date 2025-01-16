import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Zap, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LogComparison {
  frontend_log: any;
  backend_log: any;
  match_status: 'matched' | 'mismatched' | 'pending';
  timestamp: string;
  sync_score: number;
}

export function LoggingAnalyzer() {
  const [logComparisons, setLogComparisons] = useState<LogComparison[]>([]);
  const [syncStatus, setSyncStatus] = useState<{
    total: number;
    matched: number;
    accuracy: number;
  }>({ total: 0, matched: 0, accuracy: 0 });
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔍 Initializing logging analyzer...');
    
    const channels = [
      supabase
        .channel('functionality-logs')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'functionality_test_logs' },
          (payload) => {
            console.log('📝 New functionality test log:', payload);
            analyzeLogs(payload);
          }
        )
        .subscribe(),

      supabase
        .channel('communication-logs')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'communication_logs' },
          (payload) => {
            console.log('🔌 New communication log:', payload);
            analyzeLogs(payload);
          }
        )
        .subscribe(),

      supabase
        .channel('debug-logs')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'debug_logs' },
          (payload) => {
            console.log('🐛 New debug log:', payload);
            analyzeLogs(payload);
          }
        )
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const analyzeLogs = async (newLog: any) => {
    try {
      // Compare with frontend console logs
      const { data: debugLogs, error: debugError } = await supabase
        .from('debug_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (debugError) throw debugError;

      const comparison: LogComparison = {
        frontend_log: console.log('Frontend log:', newLog),
        backend_log: debugLogs[0],
        match_status: 'pending',
        timestamp: new Date().toISOString(),
        sync_score: 0
      };

      // Calculate sync score based on timestamp difference and content matching
      const timeDiff = Math.abs(
        new Date(comparison.frontend_log?.timestamp).getTime() - 
        new Date(comparison.backend_log?.timestamp).getTime()
      );
      
      comparison.sync_score = Math.max(0, 100 - (timeDiff / 1000));
      comparison.match_status = comparison.sync_score > 80 ? 'matched' : 'mismatched';

      setLogComparisons(prev => [comparison, ...prev].slice(0, 100));
      updateSyncStatus(comparison);

      // Log to Supabase for genetic-level precision tracking
      await supabase.from('debug_thread_analysis').insert({
        page_path: window.location.pathname,
        thread_type: 'log_synchronization',
        analysis_data: {
          comparison,
          sync_score: comparison.sync_score,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error analyzing logs:', error);
      toast({
        variant: "destructive",
        title: "Log Analysis Error",
        description: "Failed to analyze log synchronization"
      });
    }
  };

  const updateSyncStatus = (newComparison: LogComparison) => {
    setSyncStatus(prev => {
      const total = prev.total + 1;
      const matched = prev.matched + (newComparison.match_status === 'matched' ? 1 : 0);
      return {
        total,
        matched,
        accuracy: (matched / total) * 100
      };
    });
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle className="text-gray-100">Log Synchronization Analysis</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={`${
              syncStatus.accuracy > 90 
                ? 'bg-green-500/10 text-green-400' 
                : syncStatus.accuracy > 70
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {syncStatus.accuracy.toFixed(1)}% Sync Accuracy
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {logComparisons.map((comparison, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  comparison.match_status === 'matched'
                    ? 'border-green-500/30 bg-green-500/10'
                    : comparison.match_status === 'mismatched'
                    ? 'border-red-500/30 bg-red-500/10'
                    : 'border-yellow-500/30 bg-yellow-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {comparison.match_status === 'matched' ? (
                      <Zap className="h-4 w-4 text-green-400" />
                    ) : comparison.match_status === 'mismatched' ? (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    ) : (
                      <Database className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-sm font-medium text-gray-200">
                      Sync Score: {comparison.sync_score.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(comparison.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400">Frontend Log</span>
                    <pre className="text-xs bg-black/30 p-2 rounded">
                      {JSON.stringify(comparison.frontend_log, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400">Backend Log</span>
                    <pre className="text-xs bg-black/30 p-2 rounded">
                      {JSON.stringify(comparison.backend_log, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}