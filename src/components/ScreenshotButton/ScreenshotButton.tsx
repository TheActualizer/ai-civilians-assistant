import { useState } from 'react';
import html2canvas from 'html2canvas';
import { Camera, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ScreenshotButton = () => {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreen = async () => {
    try {
      setIsCapturing(true);
      console.log('Initiating screenshot capture...');

      const mainContent = document.querySelector('main') || document.body;
      const canvas = await html2canvas(mainContent, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      console.log('Screenshot captured, preparing download...');

      // Create download link
      const link = document.createElement('a');
      link.download = `portal-snapshot-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Reality Snapshot Captured! 📸",
        description: "Portal state has been preserved in your local dimension.",
      });

      console.log('Screenshot downloaded successfully');
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      toast({
        variant: "destructive",
        title: "Portal Capture Failed",
        description: "Unable to capture current reality state. Please try again.",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={`rounded-full p-4 transition-all duration-200 ${
        isCapturing ? 'bg-green-500/20 border-green-500' : 'hover:bg-primary/20'
      }`}
      onClick={captureScreen}
      disabled={isCapturing}
    >
      {isCapturing ? (
        <Check className="h-6 w-6 text-green-500 animate-pulse" />
      ) : (
        <Camera className="h-6 w-6 text-primary" />
      )}
      <span className="sr-only">Capture portal state</span>
    </Button>
  );
};