import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function Analytics() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-2xl text-gray-100">Analytics Dashboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Enterprise-wide analytics and insights platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}