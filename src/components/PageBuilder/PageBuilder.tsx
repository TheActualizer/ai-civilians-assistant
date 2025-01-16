import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, FilePlus, FileCheck, FileX, ArrowRight, ArrowLeft, Loader, Check, X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  route: string;
  status: 'pending' | 'building' | 'completed' | 'error';
}

export function PageBuilder() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'enterprise-overview',
      name: 'Enterprise Overview',
      description: 'Main enterprise dashboard and overview page',
      route: '/enterprise',
      status: 'pending'
    },
    {
      id: 'infrastructure-hub',
      name: 'Infrastructure Hub',
      description: 'Infrastructure management and monitoring',
      route: '/infrastructure',
      status: 'pending'
    },
    {
      id: 'technology-center',
      name: 'Technology Center',
      description: 'Technology overview and management',
      route: '/technology',
      status: 'pending'
    }
  ]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const startBuild = async (template: Template) => {
    setCurrentTemplate(template);
    
    // Update template status
    setTemplates(prev => prev.map(t => 
      t.id === template.id ? { ...t, status: 'building' } : t
    ));

    try {
      console.log(`Starting build for template: ${template.name}`);
      
      // Create rebuild operation record
      const { data: operation, error: rebuildError } = await supabase
        .from('rebuild_operations')
        .insert({
          version_ids: [template.id],
          rebuild_type: 'template',
          rebuild_source: 'page-builder',
          rebuild_priority: 1,
          rebuild_config: {
            template_name: template.name,
            route: template.route
          }
        })
        .select()
        .single();

      if (rebuildError) throw rebuildError;

      // Log the build start
      addBuildLog(`🚀 Started building ${template.name}`);
      
      // Simulate build process (replace with actual build logic)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update template status to completed
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? { ...t, status: 'completed' } : t
      ));
      
      addBuildLog(`✅ Successfully built ${template.name}`);
      
      toast({
        title: "Build Completed",
        description: `Successfully built ${template.name}`,
      });
    } catch (error) {
      console.error('Build error:', error);
      
      // Update template status to error
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? { ...t, status: 'error' } : t
      ));
      
      addBuildLog(`❌ Error building ${template.name}: ${error.message}`);
      
      toast({
        variant: "destructive",
        title: "Build Failed",
        description: `Failed to build ${template.name}`,
      });
    }
  };

  const addBuildLog = (message: string) => {
    setBuildLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const getStatusIcon = (status: Template['status']) => {
    switch (status) {
      case 'building':
        return <Loader className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <FilePlus className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <CardTitle>Page Builder</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Templates List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(template.status)}
                            <h3 className="font-medium">{template.name}</h3>
                          </div>
                          <Badge variant={template.status === 'completed' ? 'default' : 'secondary'}>
                            {template.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                        <Button
                          onClick={() => startBuild(template)}
                          disabled={template.status === 'building' || template.status === 'completed'}
                          className="w-full"
                        >
                          {template.status === 'building' ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Building...
                            </>
                          ) : template.status === 'completed' ? (
                            <>
                              <FileCheck className="mr-2 h-4 w-4" />
                              Built
                            </>
                          ) : (
                            <>
                              <ArrowRight className="mr-2 h-4 w-4" />
                              Start Build
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Build Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Build Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="space-y-2 font-mono text-sm">
                    {buildLogs.map((log, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-400">
                        {log}
                      </div>
                    ))}
                    {buildLogs.length === 0 && (
                      <div className="text-gray-400 text-center py-4">
                        No build logs yet. Start building a template to see logs here.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}