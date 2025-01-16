import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Video, ScreenShare, Grid, Layout } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceContainerProps {
  children: React.ReactNode;
  title?: string;
}

export function WorkspaceContainer({ children, title = "Workspace" }: WorkspaceContainerProps) {
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layout, setLayout] = useState<'single' | 'split' | 'grid'>('single');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        console.log('Screen sharing started:', stream);
        setIsScreenSharing(true);
        toast({
          title: "Screen Sharing Active",
          description: "Your screen is now being shared",
        });
      } else {
        setIsScreenSharing(false);
        toast({
          title: "Screen Sharing Stopped",
          description: "Screen sharing has been stopped",
        });
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast({
        variant: "destructive",
        title: "Screen Sharing Error",
        description: "Failed to start screen sharing",
      });
    }
  };

  const handleVideoToggle = async () => {
    try {
      if (!isVideoActive) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Video stream started:', stream);
        setIsVideoActive(true);
        toast({
          title: "Video Active",
          description: "Your camera is now active",
        });
      } else {
        setIsVideoActive(false);
        toast({
          title: "Video Stopped",
          description: "Your camera has been turned off",
        });
      }
    } catch (error) {
      console.error('Error toggling video:', error);
      toast({
        variant: "destructive",
        title: "Video Error",
        description: "Failed to access camera",
      });
    }
  };

  return (
    <motion.div 
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full'}`}
      layout
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full bg-gradient-to-b from-gray-900/50 to-gray-900/30 backdrop-blur-sm border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-200">{title}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVideoToggle}
              className={`${
                isVideoActive ? 'bg-green-500/20 border-green-500' : ''
              }`}
            >
              <Video className={`h-4 w-4 ${isVideoActive ? 'text-green-500' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleScreenShare}
              className={`${
                isScreenSharing ? 'bg-green-500/20 border-green-500' : ''
              }`}
            >
              <ScreenShare className={`h-4 w-4 ${isScreenSharing ? 'text-green-500' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLayout(layout === 'single' ? 'split' : layout === 'split' ? 'grid' : 'single')}
            >
              {layout === 'single' ? (
                <Layout className="h-4 w-4" />
              ) : layout === 'split' ? (
                <Grid className="h-4 w-4" />
              ) : (
                <Layout className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <ScrollArea className={`p-4 ${
          layout === 'grid' 
            ? 'grid grid-cols-2 gap-4' 
            : layout === 'split' 
              ? 'flex gap-4' 
              : ''
        }`}>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}