import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Video, Film, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VideoSynthesis {
  id: string;
  prompt: string;
  status: string;
  synthesized_output: {
    url: string | null;
    duration: number | null;
    timestamp: string | null;
    quality_score: number | null;
  };
  metadata: {
    tags: string[];
    category: string | null;
    visual_elements: string[];
    narrative_elements: string[];
  };
}

export default function VideoSynthesis() {
  const [videos, setVideos] = useState<VideoSynthesis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_video_synthesis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Failed to load video syntheses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">AI Video Synthesis</h1>
        </div>
        <Button className="gap-2">
          <Video className="h-4 w-4" />
          New Synthesis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-32 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gray-900/50 border-gray-700 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-gray-100 truncate">{video.prompt}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      video.status === 'completed' 
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {video.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {video.synthesized_output.url ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <video 
                        className="w-full h-full object-cover"
                        src={video.synthesized_output.url}
                        controls
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  
                  <div className="mt-4 space-y-2">
                    {video.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {video.metadata.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {video.synthesized_output.quality_score && (
                      <div className="text-sm text-gray-400">
                        Quality Score: {Math.round(video.synthesized_output.quality_score * 100)}%
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}