import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, HardDrive, Activity } from "lucide-react";

const DataCenter = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar session={session} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Server Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Manage and monitor server resources</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Optimize data storage solutions</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-primary" />
                Backup Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Manage backup and recovery</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataCenter;