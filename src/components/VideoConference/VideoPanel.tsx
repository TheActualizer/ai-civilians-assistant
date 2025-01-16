import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { VideoState } from "./types";
import { motion } from "framer-motion";

interface VideoPanelProps {
  videoState: VideoState;
  onToggleVideo: () => void;
}

export const VideoPanel = ({ videoState, onToggleVideo }: VideoPanelProps) => {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Video Conference
          </CardTitle>
          <Button
            variant={videoState.isActive ? "destructive" : "default"}
            onClick={onToggleVideo}
            className="gap-2"
          >
            <Video className="h-4 w-4" />
            {videoState.isActive ? "End Call" : "Start Call"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="aspect-video rounded-lg bg-black/50 flex items-center justify-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {videoState.isActive ? (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-gray-400">Video Conference Active</p>
                <p className="text-sm text-gray-500">
                  {videoState.participants.length} Participants
                </p>
                <div className="flex gap-2 justify-center">
                  {videoState.participants.map((participant, index) => (
                    <motion.div
                      key={participant}
                      className="w-2 h-2 rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Video className="h-16 w-16 text-gray-600" />
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};