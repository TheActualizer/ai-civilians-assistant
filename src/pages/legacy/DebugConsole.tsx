import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bug } from "lucide-react";

export default function LegacyDebugConsole() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6"
    >
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-primary" />
            <CardTitle className="text-gray-100">Legacy Debug Console</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">
            Previous version of the debugging interface. This page has been preserved for reference.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}