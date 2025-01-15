import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight } from "lucide-react";

const AddressValidation = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddressValidation = async () => {
    setLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      console.log("🔄 Validating address:", address);
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
      console.log('✅ Validation result:', data);
      setValidationResult(data);
    } catch (err) {
      console.error('❌ Error validating address:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    navigate('/parcel-details', { 
      state: { 
        address,
        validationResult 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Address Validation</h1>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>LightBox Address Validation</CardTitle>
              <CardDescription>
                Validate and standardize North American addresses using LightBox's advanced address-matching system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium">Validation Results:</h3>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                      {JSON.stringify(validationResult, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="flex justify-end mt-6">
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressValidation;