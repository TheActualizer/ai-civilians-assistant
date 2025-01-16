import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { siteStructureService } from "@/services/site-structure/SiteStructureService";
import type { SiteStructurePage } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function DynamicPage() {
  const [pageData, setPageData] = useState<SiteStructurePage | null>(null);
  const [loading, setLoading] = useState(true);
  const { hubName, pagePath } = useParams();

  useEffect(() => {
    const loadPageData = async () => {
      try {
        console.log("🔄 Loading page data...", { hubName, pagePath });
        const pages = await siteStructureService.getPages();
        const currentPage = pages.find(p => 
          (hubName && p.hub_name?.toLowerCase() === hubName.toLowerCase()) ||
          (pagePath && p.page_path === `/${pagePath}`)
        );

        if (currentPage) {
          console.log("✅ Page data loaded:", currentPage);
          setPageData(currentPage);
        } else {
          console.warn("⚠️ No page data found for:", { hubName, pagePath });
        }
      } catch (error) {
        console.error("❌ Error loading page:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [hubName, pagePath]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
            <p className="text-gray-600 mt-2">The requested page could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{pageData.title}</CardTitle>
          {pageData.description && (
            <p className="text-gray-600">{pageData.description}</p>
          )}
        </CardHeader>
        <CardContent>
          {pageData.component_data.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
          
          {pageData.component_data.features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {pageData.component_data.features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}