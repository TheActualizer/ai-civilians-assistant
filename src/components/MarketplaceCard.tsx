import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, DollarSign, Clock } from "lucide-react";

interface Listing {
  id: number;
  title: string;
  type: string;
  category: string;
  budget?: string;
  rate?: string;
  location: string;
  description: string;
  image: string;
  postedBy: {
    name: string;
    role: string;
    avatar: string;
  };
}

interface MarketplaceCardProps {
  listing: Listing;
}

const MarketplaceCard = ({ listing }: MarketplaceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
              {listing.type}
            </span>
          </div>
        </div>
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-500">{listing.category}</p>
            </div>
            <div className="flex -space-x-2">
              <img
                src={listing.postedBy.avatar}
                alt={listing.postedBy.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {listing.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              {listing.location}
            </div>
            {listing.budget && (
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="h-4 w-4 mr-2" />
                {listing.budget}
              </div>
            )}
            {listing.rate && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {listing.rate}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50">
          <div className="w-full flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{listing.postedBy.name}</p>
              <p className="text-gray-500">{listing.postedBy.role}</p>
            </div>
            <Button>Contact</Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MarketplaceCard;