import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Atom, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Experiments() {
  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        console.log("🔄 Fetching experiments data...");
        const { data, error } = await supabase
          .from('debug_thread_analysis')
          .select('*')
          .eq('thread_type', 'experiment');

        if (error) {
          console.error("❌ Error fetching experiments:", error);
          toast({
            title: "Error loading experiments",
            description: "Please try again later",
            variant: "destructive",
          });
          throw error;
        }

        console.log("✅ Experiments data loaded:", data);
        setExperiments(data || []);
      } catch (error) {
        console.error("❌ Error in experiments component:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Atom className="h-6 w-6 text-pink-400" />
            <CardTitle className="text-2xl text-gray-100">Experiments</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {experiments.length === 0 ? (
            <p className="text-gray-400">No active experiments found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {experiments.map((experiment) => (
                <Card key={experiment.id} className="bg-black/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-200 mb-2">
                      {experiment.title || 'Untitled Experiment'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {experiment.description || 'No description available'}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Status: {experiment.analysis_status || 'pending'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}