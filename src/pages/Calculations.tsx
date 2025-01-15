import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ProcessingStatus } from "@/components/GetStarted/ProcessingStatus";
import { supabase } from "@/integrations/supabase/client";

const Calculations = () => {
  const session = useSession();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Calculation Dashboard</h1>
        {latestRequestId ? (
          <ProcessingStatus requestId={latestRequestId} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No property requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculations;