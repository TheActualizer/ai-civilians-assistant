import { useEffect, useRef, useState } from 'react';
import { Camera, Maximize2, Minimize2, Play, Pause } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import html2canvas from 'html2canvas';

interface ClaudeScreenAnalysisProps {
  onAnalysisComplete?: (data: any) => void;
}

export function ClaudeScreenAnalysis({ onAnalysisComplete }: ClaudeScreenAnalysisProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastCapture, setLastCapture] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [autoCapture, setAutoCapture] = useState(false);
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout | null>(null);

  const captureScreen = async () => {
    try {
      setIsCapturing(true);
      console.log('Initiating high-quality screen capture...');

      const mainContent = document.querySelector('main') || document.body;
      const canvas = await html2canvas(mainContent, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const captureData = canvas.toDataURL('image/png');
      setLastCapture(captureData);

      // Simulate Claude's analysis of the screen
      const mockAnalysis = {
        timestamp: new Date().toISOString(),
        elements_detected: Math.floor(Math.random() * 50) + 20,
        interaction_points: Math.floor(Math.random() * 10) + 5,
        performance_metrics: {
          render_time: Math.random() * 100 + 50,
          memory_usage: Math.random() * 500 + 200,
          cpu_utilization: Math.random() * 60 + 20
        }
      };

      setAnalysisData(mockAnalysis);
      onAnalysisComplete?.(mockAnalysis);

      console.log('Screen capture and analysis completed:', mockAnalysis);
    } catch (error) {
      console.error('Screen capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (autoCapture && !captureInterval) {
      const interval = setInterval(captureScreen, 5000); // Capture every 5 seconds
      setCaptureInterval(interval);
    } else if (!autoCapture && captureInterval) {
      clearInterval(captureInterval);
      setCaptureInterval(null);
    }

    return () => {
      if (captureInterval) {
        clearInterval(captureInterval);
      }
    };
  }, [autoCapture]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div ref={captureRef} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Screen Analysis</h3>
          <Badge variant={isCapturing ? "default" : "outline"}>
            {isCapturing ? "Capturing..." : "Ready"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoCapture(!autoCapture)}
          >
            {autoCapture ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Auto
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Auto Capture
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <ScrollArea className={`rounded-lg border ${isFullscreen ? 'h-[600px]' : 'h-[300px]'}`}>
        <div className="p-4 space-y-4">
          {lastCapture && (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-gray-700">
                <img
                  src={lastCapture}
                  alt="Screen Capture"
                  className="w-full object-cover"
                />
              </div>
              {analysisData && (
                <div className="space-y-2 p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-medium text-gray-200">Analysis Results</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Elements Detected:</span>
                      <span className="ml-2 text-gray-200">{analysisData.elements_detected}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Interaction Points:</span>
                      <span className="ml-2 text-gray-200">{analysisData.interaction_points}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Render Time:</span>
                      <span className="ml-2 text-gray-200">
                        {analysisData.performance_metrics.render_time.toFixed(2)}ms
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">CPU Usage:</span>
                      <span className="ml-2 text-gray-200">
                        {analysisData.performance_metrics.cpu_utilization.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}