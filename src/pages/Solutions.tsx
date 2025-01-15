import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  Layers,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Solutions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-accent/5 to-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Your Research Assistant for</span>
              <span className="block text-primary">Smarter, Faster Designs</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            >
              AI Civil Engineer automates time-consuming zoning research, geospatial analysis, and feasibility calculations, giving architects more time to focus on design.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
            >
              <div className="rounded-md shadow">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/get-started")}
                >
                  Start Automating Now
                </Button>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/learn-more")}
                >
                  Learn How It Works
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Architects Love Section */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              We Do the Heavy Lifting—You Focus on the Vision
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Automated Research
                </CardTitle>
                <CardDescription>
                  Gather zoning codes, overlays, FAR requirements, and setback rules in seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No more manual parsing through regulations or local ordinances. Get instant access to all relevant data.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Instant Feasibility Reports
                </CardTitle>
                <CardDescription>
                  Calculate buildable envelopes and compliance issues instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Start sketching on verified data rather than running preliminary calculations manually.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  One-Click Visualizations
                </CardTitle>
                <CardDescription>
                  Generate zoning overlays and environmental constraints automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Validate designs without manually creating visualization layers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Carousel */}
      <section className="py-16 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 sm:text-4xl mb-12">
            More Time to Design, Less Time on Research
          </h2>
          
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[
                {
                  title: "Accelerate Early-Stage Design",
                  description: "Eliminate bottlenecks caused by missing or inaccurate data",
                  icon: <Clock className="h-8 w-8 text-primary" />
                },
                {
                  title: "Avoid Errors",
                  description: "AI reduces human errors in calculations like FAR, setbacks, and lot coverage percentages",
                  icon: <CheckCircle2 className="h-8 w-8 text-primary" />
                },
                {
                  title: "Tailored for Every Project",
                  description: "Works for residential, commercial, and mixed-use projects",
                  icon: <Layers className="h-8 w-8 text-primary" />
                },
                {
                  title: "Double-Check, Not Start From Scratch",
                  description: "Architects can validate AI results, ensuring both speed and accuracy",
                  icon: <RefreshCcw className="h-8 w-8 text-primary" />
                }
              ].map((benefit, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors h-full">
                    <CardHeader>
                      <div className="mb-4">{benefit.icon}</div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Simplify Your Next Project
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Stop wasting hours on manual research and calculations. Use AI Civil Engineer to unlock actionable insights instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="group"
              onClick={() => navigate("/get-started")}
            >
              Get Your First Report – $99
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
              onClick={() => navigate("/learn-more")}
            >
              Learn More About Automation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;