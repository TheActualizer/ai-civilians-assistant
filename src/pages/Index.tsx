import { useEffect } from "react";
import { useSystemLogger } from "@/hooks/useSystemLogger";
import Hero from "@/components/Hero";
import { LazyLoadedSection } from "@/components/home/LazyLoadedSection";
import { NewsTable } from "@/components/news/NewsTable";

const mockNewsData = [
  {
    id: "1",
    title: "New Zoning Laws Impact Urban Development",
    category: "Urban Planning",
    date: "2024-01-16",
    author: "Jane Smith",
    summary: "Recent changes in zoning regulations are reshaping how cities approach urban development...",
    readTime: "5 min",
    bookmarked: false
  },
  {
    id: "2",
    title: "Sustainable Building Materials on the Rise",
    category: "Sustainability",
    date: "2024-01-15",
    author: "John Doe",
    summary: "The construction industry is seeing a significant shift towards eco-friendly materials...",
    readTime: "4 min",
    bookmarked: true
  },
  {
    id: "3",
    title: "AI Integration in Construction Planning",
    category: "Technology",
    date: "2024-01-14",
    author: "Sarah Johnson",
    summary: "Artificial intelligence is revolutionizing how construction projects are planned and executed...",
    readTime: "6 min",
    bookmarked: false
  }
];

const Index = () => {
  const { logSystemEvent } = useSystemLogger();

  useEffect(() => {
    logSystemEvent("User accessed microservices dashboard", {
      component: 'Index',
      route: '/',
      metrics: {
        executionTime: performance.now(),
        memoryUsage: 0,
        apiLatency: 0
      }
    });
  }, [logSystemEvent]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <LazyLoadedSection>
        <Hero />
      </LazyLoadedSection>
      
      <LazyLoadedSection delay={0.2}>
        <div className="container mx-auto px-4 py-12">
          <NewsTable initialData={mockNewsData} />
        </div>
      </LazyLoadedSection>
    </div>
  );
};

export default Index;