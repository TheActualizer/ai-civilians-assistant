import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function MobileViewPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    // Only show the prompt if we're on a mobile device
    if (isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  const handleRequestDesktopView = () => {
    try {
      // Try to set the viewport meta tag to request desktop view
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=1024');
      }
      
      toast({
        title: "Desktop view enabled",
        description: "The page will now display in desktop mode for optimal viewing.",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error setting desktop view:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to enable desktop view. Please try changing this in your browser settings.",
      });
    }
  };

  const handleDecline = () => {
    toast({
      title: "Continuing with mobile view",
      description: "You can always enable desktop view from your browser settings.",
    });
    setIsOpen(false);
  };

  if (!isMobile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Optimize Your Experience</DialogTitle>
          <DialogDescription>
            This application is optimized for desktop viewing. Would you like to switch to desktop view for the best experience?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="sm:order-1"
          >
            Continue with Mobile View
          </Button>
          <Button
            onClick={handleRequestDesktopView}
            className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] hover:from-[#7C3AED] hover:to-[#0284C7] text-white sm:order-2"
          >
            Enable Desktop View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}