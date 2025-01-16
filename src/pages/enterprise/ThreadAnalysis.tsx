import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Network, GitBranch, GitMerge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { ThreadAnalysis } from '@/types/agent';

export default function ThreadAnalysis() {
  const [threads, setThreads] = useState<ThreadAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        console.log("Fetching thread analysis data...");
        const { data, error } = await supabase
          .from('debug_thread_analysis')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log("Fetched threads:", data);
        setThreads(data || []);
      } catch (error) {
        console.error("Error fetching threads:", error);
        toast({
          variant: "destructive",
          title: "Error fetching threads",
          description: "Failed to load thread analysis data"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [toast]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Network className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Thread Analysis</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {threads.map((thread) => (
            <Card key={thread.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {thread.connection_status === 'connected' ? (
                    <GitMerge className="h-5 w-5 text-green-500" />
                  ) : (
                    <GitBranch className="h-5 w-5 text-yellow-500" />
                  )}
                  {thread.thread_type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Status: {thread.connection_status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Score: {thread.connection_score}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last Analysis: {new Date(thread.last_analysis_timestamp || '').toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}