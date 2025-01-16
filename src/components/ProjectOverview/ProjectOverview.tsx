import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Building2, Calculator, FileText, Map, DatabaseIcon, Code, Workflow } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type KnowledgeBaseEntry = Database['public']['Tables']['knowledge_base']['Row'];

export function ProjectOverview() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (err) {
        console.error('Error fetching knowledge base:', err);
        setError('Failed to load project information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, []);

  if (isLoading) {
    return <div>Loading project overview...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const sections = [
    {
      id: 'overview',
      title: 'Project Overview',
      icon: Building2,
      content: 'Property assessment and analysis platform with real-time processing.'
    },
    {
      id: 'calculations',
      title: 'Calculations Engine',
      icon: Calculator,
      content: 'Advanced zoning calculations including FAR, setbacks, and compliance checks.'
    },
    {
      id: 'geospatial',
      title: 'Geospatial Processing',
      icon: Map,
      content: 'Interactive mapping and visualization of property data and zoning overlays.'
    },
    {
      id: 'reports',
      title: 'Report Generation',
      icon: FileText,
      content: 'Automated generation of detailed property analysis reports.'
    },
    {
      id: 'pipeline',
      title: 'Data Pipeline',
      icon: Workflow,
      content: 'End-to-end processing from submission to final report delivery.'
    }
  ];

  return (
    <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DatabaseIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-gray-100">Project Scope & Features</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Comprehensive overview of the property assessment platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{section.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-primary" />
                      <CardTitle>{section.title}</CardTitle>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {entries
                        .filter(entry => entry.category.toLowerCase() === section.id)
                        .map(entry => (
                          <div key={entry.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h3 className="text-lg font-medium text-gray-100">{entry.title}</h3>
                            <p className="mt-2 text-gray-400">{entry.content}</p>
                            <div className="mt-4 flex gap-2">
                              {entry.tags && entry.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      {entries.filter(entry => entry.category.toLowerCase() === section.id).length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Code className="h-8 w-8 mx-auto mb-2" />
                          <p>No documentation available yet for this section</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}