import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ProcessingStatus } from "@/components/GetStarted/ProcessingStatus";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Calculations = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [latestRequestId, setLatestRequestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestRequest = async () => {
      console.log("Fetching latest property request...");
      const { data, error } = await supabase
        .from('property_requests')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching latest request:', error);
        return;
      }

      if (data) {
        console.log('Latest request found:', data);
        setLatestRequestId(data.id);
      }
    };

    fetchLatestRequest();
  }, []);

  const handleNextStep = () => {
    navigate('/parcel-details');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold text-gray-900">Calculation Dashboard</h1>
          
          {latestRequestId ? (
            <>
              <ProcessingStatus requestId={latestRequestId} />
              <div className="sticky bottom-8 flex justify-end mt-8 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <Button
                  onClick={handleNextStep}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white gap-2"
                  size="lg"
                >
                  View Parcel Details
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No property requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculations;