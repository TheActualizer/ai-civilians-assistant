import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Building2, DollarSign, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ParcelDetails = () => {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [parcelData, setParcelData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParcelData = async () => {
      if (!location.state?.address) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Fetching parcel data for address:", location.state.address);
        const response = await fetch(
          'https://aocjoukjdsoynvbuzvas.supabase.co/functions/v1/fetch-lightbox-parcel',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: location.state.address })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch parcel data');
        }

        const data = await response.json();
        console.log('✅ Parcel data:', data);
        setParcelData(data);
      } catch (err) {
        console.error('❌ Error fetching parcel data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParcelData();
  }, [location.state?.address]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parcel Details</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/address-validation')}
          >
            Back to Address Validation
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : parcelData ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="property">Property</TabsTrigger>
                <TabsTrigger value="tax">Tax Info</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <CardTitle>Property Overview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                      {JSON.stringify(parcelData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="property">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle>Property Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Property details will be implemented here */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tax">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <CardTitle>Tax Information</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Tax information will be implemented here */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle>Technical Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Technical details will be implemented here */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-gray-500">
                  No parcel data available. Please validate an address first.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;