import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Scale3d, Ruler, Construction, MapPin } from "lucide-react";
import { StructureViewer } from '@/components/Structures/StructureViewer';
import { StructureDetails } from '@/components/Structures/StructureDetails';
import { StructureMetrics } from '@/components/Structures/StructureMetrics';

export default function Structures() {
  const [activeStructure, setActiveStructure] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Structure Analysis</h1>
          <p className="text-gray-400 mt-1">Comprehensive building analysis and visualization</p>
        </div>
        <div className="flex items-center gap-2">
          <Construction className="h-6 w-6 text-primary animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Scale3d className="h-5 w-5 text-primary" />
                <CardTitle>3D Structure Viewer</CardTitle>
              </div>
              <CardDescription>Interactive 3D visualization of building structures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden bg-black/20">
                <StructureViewer activeStructure={activeStructure} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <StructureMetrics />
          <StructureDetails onSelectStructure={setActiveStructure} />
        </div>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Structural Analysis</CardTitle>
              </div>
              <CardDescription>Detailed analysis of building components</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {/* Analysis content will go here */}
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                        <h3 className="text-gray-300 font-medium mb-2">Analysis Section {i + 1}</h3>
                        <p className="text-gray-400 text-sm">
                          Detailed analysis information will be displayed here.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="mt-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                <CardTitle>Measurements</CardTitle>
              </div>
              <CardDescription>Precise structural measurements and dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {/* Measurements content will go here */}
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                        <h3 className="text-gray-300 font-medium mb-2">Measurement {i + 1}</h3>
                        <p className="text-gray-400 text-sm">
                          Measurement details will be displayed here.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Zoning Compliance</CardTitle>
              </div>
              <CardDescription>Building code and zoning regulation compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {/* Compliance content will go here */}
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                        <h3 className="text-gray-300 font-medium mb-2">Compliance Check {i + 1}</h3>
                        <p className="text-gray-400 text-sm">
                          Compliance information will be displayed here.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}