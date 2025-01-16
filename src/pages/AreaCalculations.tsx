import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const AreaCalculations = () => {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [area, setArea] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateArea = () => {
    const numLength = parseFloat(length);
    const numWidth = parseFloat(width);

    if (isNaN(numLength) || isNaN(numWidth)) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter valid numbers for length and width",
      });
      return;
    }

    const calculatedArea = numLength * numWidth;
    setArea(calculatedArea);
    
    toast({
      title: "Area Calculated",
      description: `The area is ${calculatedArea} square units`,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Area Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="length" className="text-sm font-medium">
                  Length
                </label>
                <Input
                  id="length"
                  type="number"
                  placeholder="Enter length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="width" className="text-sm font-medium">
                  Width
                </label>
                <Input
                  id="width"
                  type="number"
                  placeholder="Enter width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={calculateArea}
              className="w-full"
            >
              Calculate Area
            </Button>

            {area !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-primary/10 rounded-lg"
              >
                <p className="text-center text-lg font-semibold">
                  Area: {area} square units
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AreaCalculations;