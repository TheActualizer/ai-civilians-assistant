import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ZoningData {
  zoning_code?: string;
  land_use?: string;
  max_height?: number;
  setbacks?: {
    front?: number;
    back?: number;
    sides?: number;
  };
  coverage?: number;
}

export default function ZoningAnalysis() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [zoningData, setZoningData] = useState<ZoningData | null>(null);

  useEffect(() => {
    console.log('Initializing Zoning Analysis page');
    
    const fetchZoningData = async () => {
      try {
        const { data, error } = await supabase
          .from('property_requests')
          .select('api_data->zoning')
          .eq('status', 'completed')
          .limit(1)
          .single();

        if (error) throw error;

        console.log('Fetched zoning data:', data);
        setZoningData(data?.api_data?.zoning || null);
      } catch (error) {
        console.error('Error fetching zoning data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load zoning data"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchZoningData();
  }, [toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!zoningData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">No Zoning Data Available</h2>
              <p className="mt-2 text-gray-600">
                Please submit a property request to view zoning analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6 space-y-6"
    >
      {/* Property Zoning Information */}
      <Card>
        <CardHeader>
          <CardTitle>Zoning Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Zoning Classification</h3>
              <p className="text-gray-600">{zoningData.zoning_code || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Permitted Land Use</h3>
              <p className="text-gray-600">{zoningData.land_use || 'N/A'}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Maximum Height</h3>
              <p className="text-gray-600">
                {zoningData.max_height ? `${zoningData.max_height} feet` : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Lot Coverage</h3>
              <p className="text-gray-600">
                {zoningData.coverage ? `${zoningData.coverage}%` : 'N/A'}
              </p>
            </div>
          </div>

          {zoningData.setbacks && (
            <div>
              <h3 className="font-semibold mb-2">Required Setbacks</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Front</p>
                  <p className="text-gray-600">
                    {zoningData.setbacks.front ? `${zoningData.setbacks.front} feet` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Back</p>
                  <p className="text-gray-600">
                    {zoningData.setbacks.back ? `${zoningData.setbacks.back} feet` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sides</p>
                  <p className="text-gray-600">
                    {zoningData.setbacks.sides ? `${zoningData.setbacks.sides} feet` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}