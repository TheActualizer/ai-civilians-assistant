import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  address: z.string().min(5, "Please enter a valid address"),
  description: z.string().optional(),
});

const GetStarted = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    toast.success("Form submitted successfully!");
    // TODO: Implement form submission logic
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Let's Start Your Building Analysis Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Get your detailed zoning analysis, feasibility reports, and maximum buildable area calculations at a fraction of the cost.
        </p>
        <Button size="lg" className="text-lg px-8">
          Begin Your Report – $99
        </Button>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Tell Us About Your Property</CardTitle>
            <CardDescription>
              Fill in the details below to get started with your analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your property and requirements..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Unbeatable Value</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>AI Civil Engineer</CardTitle>
                <CardDescription>Fast, Accurate, Affordable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">$99</div>
                <p className="text-gray-600">Report delivered in under a minute</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Traditional Engineering Firms</CardTitle>
                <CardDescription>Standard Industry Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-600 mb-4">$1,500</div>
                <p className="text-gray-600">2-4 weeks delivery time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetStarted;