import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { AddressForm } from "@/components/GetStarted/AddressForm";
import { PricingComparison } from "@/components/GetStarted/PricingComparison";
import { FormValues } from "@/components/GetStarted/schema";

// Define libraries array outside component to prevent unnecessary reloads
const libraries: ("places")[] = ["places"];

const GetStarted = () => {
  const session = useSession();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
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
        
        toast.success("Address validated successfully!");
      }
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Form values:", values);

      // Validate address using Edge Function
      const fullAddress = `${values.streetAddress}, ${values.city}, ${values.state} ${values.zipCode}`;
      console.log("Validating address:", fullAddress);
      
      const { data: validatedAddress, error: validationError } = await supabase.functions.invoke('validate-address', {
        body: { address: fullAddress }
      });

      if (validationError) {
        console.error('Address validation error:', validationError);
        toast.error("Failed to validate address");
        return;
      }

      console.log("Validated address:", validatedAddress);

      // Insert validated address into database
      const { error: insertError } = await supabase
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

      if (insertError) {
        console.error('Error submitting property request:', insertError);
        toast.error("Failed to submit property request");
        return;
      }

      toast.success("Property request submitted successfully!");
      
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
          <AddressForm 
            onSubmit={onSubmit}
            setAutocomplete={setAutocomplete}
            onPlaceSelected={onPlaceSelected}
          />
        </section>

        <PricingComparison />
      </div>
    </div>
  );
};

export default GetStarted;