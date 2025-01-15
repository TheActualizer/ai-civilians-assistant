import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";

const zipCodeRegex = /^\d{5}(-\d{4})?$/;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().length(2, "Please enter a valid 2-letter state code"),
  zipCode: z.string().regex(zipCodeRegex, "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"),
  description: z.string().optional(),
});

const GetStarted = () => {
  const session = useSession();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  
  console.log("Current session:", session);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ["places"]
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      description: "",
    },
  });

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log("Selected place:", place);

      if (place.address_components) {
        let streetNumber = '';
        let streetName = '';
        let city = '';
        let state = '';
        let zipCode = '';

        place.address_components.forEach((component) => {
          const types = component.types;
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            streetName = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
          if (types.includes('postal_code')) {
            zipCode = component.long_name;
          }
        });

        const fullStreetAddress = `${streetNumber} ${streetName}`.trim();
        
        form.setValue('streetAddress', fullStreetAddress);
        form.setValue('city', city);
        form.setValue('state', state);
        form.setValue('zipCode', zipCode);

        toast.success("Address validated successfully!");
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Form values:", values);
      
      if (!zipCodeRegex.test(values.zipCode)) {
        console.log("Invalid ZIP code");
        toast.error("Please enter a valid ZIP code");
        return;
      }

      // Validate address using Edge Function
      const fullAddress = `${values.streetAddress}, ${values.city}, ${values.state} ${values.zipCode}`
      const response = await fetch('https://aocjoukjdsoynvbuzvas.supabase.co/functions/v1/validate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ address: fullAddress })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to validate address');
      }

      const validatedAddress = await response.json();
      console.log("Validated address:", validatedAddress);

      // Insert validated address into database
      const { error } = await supabase
        .from('property_requests')
        .insert({
          name: values.name,
          email: values.email,
          street_address: validatedAddress.street_address,
          city: validatedAddress.city,
          state: validatedAddress.state,
          zip_code: validatedAddress.zip_code,
          description: values.description || '',
          user_id: session?.user?.id || null,
          metadata: {
            formatted_address: validatedAddress.formatted_address,
            coordinates: validatedAddress.coordinates
          }
        });

      if (error) {
        console.error('Error submitting property request:', error);
        toast.error("Failed to submit property request");
        return;
      }

      toast.success("Property request submitted successfully!");
      form.reset();
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("There was an error validating your address");
    }
  };

  if (loadError) {
    toast.error("Error loading Google Maps");
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-12 px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's Generate Your Building Analysis Report
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get your detailed zoning analysis, feasibility reports, and maximum buildable area calculations at a fraction of the cost.
          </p>
        </section>

        {/* Form Section */}
        <section className="max-w-2xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Tell Us About Your Property</CardTitle>
              <CardDescription>
                Fill in the details below to generate your analysis
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
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Autocomplete
                            onLoad={setAutocomplete}
                            onPlaceChanged={onPlaceSelected}
                            restrictions={{ country: "us" }}
                          >
                            <Input 
                              placeholder="Start typing your address..." 
                              {...field}
                            />
                          </Autocomplete>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="NY" 
                                maxLength={2}
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.toUpperCase();
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="12345" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

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
                    Generate Report
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
    </div>
  );
};

export default GetStarted;
