import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Newspaper,
  Calendar,
  Bookmark,
  Share2,
  Search,
  ArrowUpDown
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  summary: string;
  readTime: string;
  bookmarked: boolean;
}

interface NewsTableProps {
  initialData: NewsItem[];
}

export const NewsTable = ({ initialData }: NewsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof NewsItem;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });
  const [data, setData] = useState<NewsItem[]>(initialData);

  const handleSort = (key: keyof NewsItem) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] < b[key] ? -1 : 1;
      }
      return a[key] > b[key] ? -1 : 1;
    });
    setData(sortedData);
  };

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">News Feed</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('title')}
                  className="flex items-center"
                >
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('category')}
                  className="flex items-center"
                >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('date')}
                  className="flex items-center"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="group hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.readTime} read</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {/* Add bookmark handler */}}
                    >
                      <Bookmark className={`h-4 w-4 ${item.bookmarked ? 'fill-primary' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {/* Add share handler */}}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};