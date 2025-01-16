import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Ruler, Scale } from "lucide-react";

export default function Structures() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Engineering Dashboard</h1>
          <p className="text-gray-400 mt-1">Structure Analysis & Management</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-200">Total Structures</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">12</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-200">Average Height</CardTitle>
            <Scale className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">45 ft</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-200">Total Area</CardTitle>
            <Ruler className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">25,000 sq ft</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Structure List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Structures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Main Building', 'Storage Facility', 'Office Block A'].map((structure, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="text-gray-200">{structure}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Center and Right Columns - Placeholder for future content */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Structure Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-400">Select a structure to view details</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}