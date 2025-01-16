import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Archive } from "lucide-react";

const LegacyParcelAnalysis = () => {
  return (
    <div className="container mx-auto p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Archive className="h-6 w-6 text-gray-500" />
          <h1 className="text-3xl font-bold text-gray-900">Legacy Parcel Analysis</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Original Parcel Analysis Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                This is the legacy version of our parcel analysis interface. It contains the original
                tools and features that were used in previous versions of the application.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Basic Parcel Details</h3>
                    <p className="text-sm text-gray-600">
                      Original implementation of parcel information display and analysis tools.
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

export default LegacyParcelAnalysis;