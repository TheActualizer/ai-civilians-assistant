import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ProcessingStatus } from "@/components/GetStarted/ProcessingStatus";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Calculations = () => {
  const session = useSession();
  const [latestRequestId, setLatestRequestId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleAddressValidation = async () => {
    setLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const response = await fetch(
        'https://aocjoukjdsoynvbuzvas.supabase.co/functions/v1/validate-lightbox-address',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to validate address');
      }

      const data = await response.json();
      console.log('Validation result:', data);
      setValidationResult(data);
    } catch (err) {
      console.error('Error validating address:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Calculation Dashboard</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Address Validation</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter address to validate"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddressValidation}
                  disabled={loading || !address}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Validate
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {validationResult && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium">Validation Results:</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                    {JSON.stringify(validationResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Processing Status</h2>
            {latestRequestId ? (
              <ProcessingStatus requestId={latestRequestId} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No property requests found.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculations;