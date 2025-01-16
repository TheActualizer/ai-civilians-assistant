import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

interface StructureDetailsProps {
  onSelectStructure: (id: string) => void;
}

export function StructureDetails({ onSelectStructure }: StructureDetailsProps) {
  const structures = [
    { id: '1', name: 'Main Building', type: 'Commercial', status: 'active' },
    { id: '2', name: 'Storage Facility', type: 'Industrial', status: 'pending' },
    { id: '3', name: 'Office Block A', type: 'Commercial', status: 'active' },
    { id: '4', name: 'Warehouse', type: 'Industrial', status: 'inactive' },
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">Structure Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {structures.map((structure) => (
              <div
                key={structure.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => onSelectStructure(structure.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-gray-200">{structure.name}</h3>
                  </div>
                  <Badge
                    variant={structure.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {structure.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{structure.type}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}