import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flask } from "lucide-react";

export default function Research() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flask className="h-6 w-6 text-indigo-400" />
            <CardTitle className="text-2xl text-gray-100">Research Center</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Advanced research and development projects.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}