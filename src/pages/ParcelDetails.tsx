import { useLocation } from 'react-router-dom';
import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ParcelDetails = () => {
  const session = useSession();
  const location = useLocation();
  const { address, validationResult } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Parcel Details</h1>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Detailed parcel information from LightBox for {address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Validated Address:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(validationResult, null, 2)}
                </pre>
                
                <div className="mt-6">
                  <p className="text-gray-600">
                    Loading parcel details...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;