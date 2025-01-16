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
  ArrowUpDown,
  ChevronDown,
  ExternalLink
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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

  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
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
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[500px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('title')}
                  className="flex items-center"
                >
                  Title & Summary
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('category')}
                  className="flex items-center"
                >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[200px]">
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
              <TableHead className="w-[200px]">Author</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <motion.tr
                key={item.id}
                className="group hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleRowExpansion(item.id)}
                initial={false}
                animate={{ backgroundColor: expandedRows.has(item.id) ? 'rgba(0,0,0,0.05)' : 'transparent' }}
              >
                <TableCell className="align-top">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform ${expandedRows.has(item.id) ? 'rotate-180' : ''}`}
                        />
                        <span className="font-medium line-clamp-2">{item.title}</span>
                      </div>
                    </div>
                    {expandedRows.has(item.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-muted-foreground"
                      >
                        <p className="whitespace-pre-line">{item.summary}</p>
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {item.readTime} read
                          </span>
                          <ExternalLink className="ml-2 h-3 w-3 cursor-pointer hover:text-primary" />
                        </div>
                      </motion.div>
                    )}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add bookmark handler
                      }}
                    >
                      <Bookmark className={`h-4 w-4 ${item.bookmarked ? 'fill-primary' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add share handler
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};