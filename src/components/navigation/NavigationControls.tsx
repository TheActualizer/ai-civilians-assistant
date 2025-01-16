import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function NavigationControls() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      toast({
        title: "Navigation",
        description: "No previous page in history",
        variant: "default"
      });
    }
  };

  const handleForward = () => {
    navigate(1);
  };

  return (
    <div className="fixed top-24 left-4 z-40 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleBack}
        className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleForward}
        className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}