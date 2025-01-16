import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Reporting() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-br from-green-500/10 to-yellow-500/10 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-green-400" />
            <CardTitle className="text-2xl text-gray-100">Reporting Center</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Generate and analyze operational reports.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}