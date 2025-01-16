import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  {
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    alt: "Software development visualization",
  },
  {
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    alt: "Modern architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
    alt: "Glass building architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2",
    alt: "Modern building perspective",
  },
];

const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
          >
            <div className="text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl"
              >
                <span className="block">Streamline Your</span>
                <span className="block text-primary">Building Analysis</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 text-sm text-gray-500 sm:text-base md:text-lg lg:text-xl max-w-md mx-auto lg:mx-0"
              >
                Get instant zoning analysis, feasibility reports, and maximum buildable area calculations for your projects.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-5 sm:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-2 sm:gap-4"
              >
                <Button 
                  size="lg" 
                  asChild 
                  className="w-full sm:w-auto text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link to="/get-started">Get Started</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild 
                  className="w-full sm:w-auto text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link to="/learn-more">Learn More</Link>
                </Button>
              </motion.div>
            </div>
          </motion.main>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 mt-6 lg:mt-0"
      >
        <Carousel 
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-full" 
          opts={{ 
            loop: true, 
            align: "start",
            skipSnaps: false,
            dragFree: true
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="h-full w-full relative overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4" />
          <CarouselNext className="right-2 sm:right-4" />
        </Carousel>
      </motion.div>
    </div>
  );
};

export default Hero;