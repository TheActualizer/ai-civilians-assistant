import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flask } from "lucide-react";

export default function LabProjects() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flask className="h-6 w-6 text-pink-400" />
            <CardTitle className="text-2xl text-gray-100">Lab Projects</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Experimental projects and prototypes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}