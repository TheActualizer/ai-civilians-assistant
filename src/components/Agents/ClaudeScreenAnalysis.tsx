import { useEffect, useRef, useState } from 'react';
import { Camera, Maximize2, Minimize2, Play, Pause, Activity, Cpu, Zap } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [energyLevel, setEnergyLevel] = useState(0);

  const captureScreen = async () => {
    try {
      setIsCapturing(true);
      console.log('Initiating quantum screen capture...');

      const mainContent = document.querySelector('main') || document.body;
      const canvas = await html2canvas(mainContent, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const captureData = canvas.toDataURL('image/png');
      setLastCapture(captureData);

      // Simulate advanced AI analysis
      const mockAnalysis = {
        timestamp: new Date().toISOString(),
        elements_detected: Math.floor(Math.random() * 50) + 20,
        interaction_points: Math.floor(Math.random() * 10) + 5,
        performance_metrics: {
          render_time: Math.random() * 100 + 50,
          memory_usage: Math.random() * 500 + 200,
          cpu_utilization: Math.random() * 60 + 20,
          quantum_efficiency: Math.random() * 100
        }
      };

      setAnalysisData(mockAnalysis);
      onAnalysisComplete?.(mockAnalysis);
      setEnergyLevel(prev => Math.min(prev + 10, 100));

      console.log('Quantum capture completed:', mockAnalysis);
    } catch (error) {
      console.error('Quantum capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (autoCapture && !captureInterval) {
      const interval = setInterval(captureScreen, 5000);
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 p-4 rounded-lg border border-blue-500/30"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Camera className="h-5 w-5 text-blue-400" />
            <motion.div 
              className="absolute -inset-1 bg-blue-500/20 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <h3 className="text-lg font-semibold text-blue-100">Quantum Analysis Matrix</h3>
          <Badge 
            variant={isCapturing ? "default" : "outline"}
            className={`${isCapturing ? 'bg-blue-500 animate-pulse' : 'border-blue-500/50'}`}
          >
            {isCapturing ? "Quantum Capture Active" : "Ready"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoCapture(!autoCapture)}
            className={`border-blue-500/30 hover:bg-blue-500/20 ${
              autoCapture ? 'bg-blue-500/20 text-blue-200' : 'text-blue-400'
            }`}
          >
            {autoCapture ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Matrix
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Auto Analyze
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="border-blue-500/30 hover:bg-blue-500/20 text-blue-400"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>

      <ScrollArea className={`rounded-lg border border-blue-500/30 bg-gray-900/80 backdrop-blur-sm ${
        isFullscreen ? 'h-[600px]' : 'h-[300px]'
      }`}>
        <div className="p-4 space-y-4">
          {lastCapture && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative rounded-lg overflow-hidden border border-blue-500/30">
                <img
                  src={lastCapture}
                  alt="Quantum Capture"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
              </div>
              {analysisData && (
                <motion.div 
                  className="space-y-2 p-4 bg-gray-800/50 rounded-lg border border-blue-500/20"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-blue-200 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      Quantum Analysis Results
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                        Energy: {energyLevel}%
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Cpu className="h-3 w-3" /> Elements
                        </span>
                        <span className="text-blue-200">{analysisData.elements_detected}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Zap className="h-3 w-3" /> Interactions
                        </span>
                        <span className="text-blue-200">{analysisData.interaction_points}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Render Time</span>
                        <span className="text-blue-200">
                          {analysisData.performance_metrics.render_time.toFixed(2)}ms
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">CPU Usage</span>
                        <span className="text-blue-200">
                          {analysisData.performance_metrics.cpu_utilization.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${energyLevel}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}