import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { History } from "lucide-react";

const LegacyPropertyDetails = () => {
  return (
    <div className="container mx-auto p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <History className="h-6 w-6 text-gray-500" />
          <h1 className="text-3xl font-bold text-gray-900">Legacy Property Details</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Classic Property View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                This page preserves the original property details interface, showcasing the classic
                layout and functionality from previous versions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Basic Property Information</h3>
                    <p className="text-sm text-gray-600">
                      Classic implementation of property information display.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LegacyPropertyDetails;