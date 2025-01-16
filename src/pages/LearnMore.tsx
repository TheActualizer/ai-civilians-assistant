import { useSession } from "@supabase/auth-helpers-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { ArrowRight, Database, Layout, Library, Microchip, Network, Shield, BarChart } from "lucide-react";

const LearnMore = () => {
  const session = useSession();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar session={session} />
      
      <div className="pt-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Architecture & Infrastructure
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our scalable, modular architecture designed for complex civil engineering applications
          </p>
        </section>

        <Tabs defaultValue="domains" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="domains">Core Domains</TabsTrigger>
            <TabsTrigger value="microservices">Microservices</TabsTrigger>
            <TabsTrigger value="libraries">Libraries</TabsTrigger>
            <TabsTrigger value="api">API Layer</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[600px] mt-6 rounded-md border">
            <TabsContent value="domains" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microchip className="h-6 w-6" />
                    Core Domains
                  </CardTitle>
                  <CardDescription>Main functional areas of the application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "Property Analysis Domain",
                        items: ["Parcel Analysis", "Zoning Calculations", "Environmental Assessment", "Building Envelope Analysis"]
                      },
                      {
                        title: "AI Agents Domain",
                        items: ["Agent Coordination", "Real-time Communication", "Knowledge Management", "Decision Making Pipeline"]
                      },
                      {
                        title: "User Interface Domain",
                        items: ["Interactive Maps", "Document Viewers", "Real-time Chat", "Data Visualization"]
                      }
                    ].map((domain, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mb-2">{domain.title}</h3>
                        <ul className="grid gap-2">
                          {domain.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {i < 2 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="microservices" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-6 w-6" />
                    Microservices Architecture
                  </CardTitle>
                  <CardDescription>Independent services for scalability and maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "Property Service",
                        items: ["Parcel Data Management", "Geometric Calculations", "Zoning Analysis"]
                      },
                      {
                        title: "Document Service",
                        items: ["Document Processing", "OCR Operations", "File Storage", "Version Control"]
                      },
                      {
                        title: "Agent Service",
                        items: ["Agent State Management", "Task Distribution", "Agent Communication"]
                      },
                      {
                        title: "Real-time Service",
                        items: ["WebSocket Management", "Event Broadcasting", "Status Updates"]
                      }
                    ].map((service, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                        <ul className="grid gap-2">
                          {service.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {i < 3 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="libraries" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-6 w-6" />
                    Shared Libraries
                  </CardTitle>
                  <CardDescription>Reusable code modules and utilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "@civil/core",
                        items: ["Common Utilities", "Type Definitions", "Shared Constants"]
                      },
                      {
                        title: "@civil/ui",
                        items: ["Reusable Components", "Theme Management", "Layout Systems"]
                      },
                      {
                        title: "@civil/agents",
                        items: ["Agent Protocols", "Communication Patterns", "State Management"]
                      }
                    ].map((lib, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mb-2">{lib.title}</h3>
                        <ul className="grid gap-2">
                          {lib.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {i < 2 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-6 w-6" />
                    API Layer
                  </CardTitle>
                  <CardDescription>Communication interfaces and endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "REST APIs",
                        items: ["Property Endpoints", "User Management", "Document Operations"]
                      },
                      {
                        title: "GraphQL Layer",
                        items: ["Complex Data Queries", "Real-time Subscriptions", "Data Aggregation"]
                      },
                      {
                        title: "WebSocket APIs",
                        items: ["Agent Communication", "Live Updates", "Status Broadcasting"]
                      }
                    ].map((api, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mb-2">{api.title}</h3>
                        <ul className="grid gap-2">
                          {api.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {i < 2 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-6 w-6" />
                    Storage Layer
                  </CardTitle>
                  <CardDescription>Data persistence and management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "Primary Database",
                        items: ["User Data", "Property Records", "Agent States", "System Configuration"]
                      },
                      {
                        title: "Cache Layer",
                        items: ["Redis for Real-time", "Browser Storage", "API Response Cache"]
                      },
                      {
                        title: "File Storage",
                        items: ["Document Repository", "Image Storage", "Voice Recordings"]
                      }
                    ].map((storage, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mb-2">{storage.title}</h3>
                        <ul className="grid gap-2">
                          {storage.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {i < 2 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-6 w-6" />
                    Monitoring & Analytics
                  </CardTitle>
                  <CardDescription>System health and performance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "System Monitoring",
                        items: ["Performance Metrics", "Error Tracking", "Resource Usage", "API Health"]
                      },
                      {
                        title: "Business Analytics",
                        items: ["User Engagement", "Feature Usage", "Agent Performance", "Processing Times"]
                      }
                    ].map((monitoring, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mb-2">{monitoring.title}</h3>
                        <ul className="grid gap-2">
                          {monitoring.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {i < 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Security Layer
                  </CardTitle>
                  <CardDescription>System protection and access control</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "Authentication",
                        items: ["User Authentication", "API Security", "Token Management", "Role-based Access"]
                      },
                      {
                        title: "Data Protection",
                        items: ["Encryption", "Data Masking", "Audit Logging", "Compliance Tools"]
                      }
                    ].map((security, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mb-2">{security.title}</h3>
                        <ul className="grid gap-2">
                          {security.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {i < 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="development" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microchip className="h-6 w-6" />
                    Development Infrastructure
                  </CardTitle>
                  <CardDescription>Tools and processes for development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "Development Tools",
                        items: ["Code Generation", "Testing Utilities", "Documentation", "Development Environment"]
                      },
                      {
                        title: "CI/CD Pipeline",
                        items: ["Build Process", "Testing Strategy", "Deployment Flow", "Version Management"]
                      }
                    ].map((dev, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mb-2">{dev.title}</h3>
                        <ul className="grid gap-2">
                          {dev.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {i < 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnMore;