import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

export default function ResourcePlanning() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-2xl text-gray-100">Resource Planning</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Strategic resource allocation and planning interface.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}