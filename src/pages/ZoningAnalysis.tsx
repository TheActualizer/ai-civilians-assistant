import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ZoningAnalysis() {
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('Initializing Zoning Analysis page');
    
    const fetchZoningData = async () => {
      try {
        const { data, error } = await supabase
          .from('property_requests')
          .select('*')
          .eq('status', 'completed')
          .limit(1);

        if (error) throw error;

        console.log('Fetched zoning data:', data);
      } catch (error) {
        console.error('Error fetching zoning data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load zoning data"
        });
      }
    };

    fetchZoningData();
  }, [toast]);
  
  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Zoning Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Welcome to the Zoning Analysis tool. This feature will help you analyze zoning regulations and requirements for your property.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Enter your property details to begin the zoning analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zoning Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View applicable zoning requirements and restrictions.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}