import { WorkspaceContainer } from "@/components/workspace/WorkspaceContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch } from "lucide-react";

export default function Workflow() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <WorkspaceContainer title="Workflow Management">
        <Card className="bg-gradient-to-br from-green-500/10 to-yellow-500/10 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-green-400" />
              <CardTitle className="text-2xl text-gray-100">Workflow Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Design and manage operational workflows.
            </p>
          </CardContent>
        </Card>
      </WorkspaceContainer>
    </div>
  );
}