import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, AlertTriangle } from "lucide-react";

const SecurityOperations = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Threat Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Monitor and detect security threats</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Manage security permissions</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Incident Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Handle security incidents</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecurityOperations;