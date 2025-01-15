import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import MarketplaceCard from "@/components/MarketplaceCard";
import { useSession } from "@supabase/auth-helpers-react";
import { Session } from "@supabase/supabase-js";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const session = useSession();
  const [localSession, setLocalSession] = useState<Session | null>(session);

  // Sample data - in a real app, this would come from an API
  const listings = [
    {
      id: 1,
      title: "Residential Development Project",
      type: "Project",
      category: "Development",
      budget: "$500,000 - $1,000,000",
      location: "Los Angeles, CA",
      description: "Looking for architects and civil engineers for a new residential development project.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      postedBy: {
        name: "John Developer",
        role: "Property Developer",
        avatar: "https://i.pravatar.cc/150?u=john",
      },
    },
    {
      id: 2,
      title: "Experienced Structural Engineer",
      type: "Professional",
      category: "Engineering",
      rate: "$150/hour",
      location: "Remote",
      description: "Structural engineer with 15 years of experience in commercial projects.",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      postedBy: {
        name: "Sarah Engineer",
        role: "Civil Engineer",
        avatar: "https://i.pravatar.cc/150?u=sarah",
      },
    },
    {
      id: 3,
      title: "Modern Office Building Design",
      type: "Project",
      category: "Architecture",
      budget: "$200,000 - $400,000",
      location: "New York, NY",
      description: "Seeking innovative architects for a modern office building project in Manhattan.",
      image: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=800",
      postedBy: {
        name: "Tech Innovations Inc",
        role: "Commercial Client",
        avatar: "https://i.pravatar.cc/150?u=tech",
      },
    },
  ];

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || listing.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={localSession} setSession={setLocalSession} />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Construction & Architecture Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with professionals, find projects, and bring your construction dreams to life
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects or professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[200px] h-11">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="architecture">Architecture</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-11 gap-2">
              <Filter className="h-5 w-5" />
              More Filters
            </Button>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <MarketplaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Marketplace;
