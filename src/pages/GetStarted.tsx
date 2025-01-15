import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { AddressForm } from "@/components/GetStarted/AddressForm";
import { ProcessingStatus } from "@/components/GetStarted/ProcessingStatus";
import { PricingComparison } from "@/components/GetStarted/PricingComparison";
import { FormValues } from "@/components/GetStarted/schema";

const libraries: ("places")[] = ["places"];

const GetStarted = () => {
  const session = useSession();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log("Selected place:", place);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Form values:", values);

      // Validate address using Edge Function
      const fullAddress = `${values.streetAddress}, ${values.city}, ${values.state} ${values.zipCode}`;
      console.log("Validating address:", fullAddress);
      
      const { data: validationResponse, error: validationError } = await supabase.functions.invoke('validate-address', {
        body: { address: fullAddress }
      });

      if (validationError) {
        console.error('Address validation error:', validationError);
        toast.error("Failed to validate address");
        return;
      }

      console.log("Validated address:", validationResponse);

      // Insert validated address into database
      const { data: insertedRequest, error: insertError } = await supabase
        .from('property_requests')
        .insert({
          name: values.name,
          email: values.email,
          street_address: validationResponse.street_address || values.streetAddress,
          city: validationResponse.city || values.city,
          state: validationResponse.state || values.state,
          zip_code: validationResponse.zip_code || values.zipCode,
          description: values.description || '',
          user_id: session?.user?.id || null,
          coordinates: validationResponse.coordinates || null,
          status_details: {
            address_validation: "Address validated successfully",
            geospatial_analysis: null,
            zoning_analysis: null,
            report_generation: null
          },
          processing_steps: {
            address_validated: true,
            coordinates_mapped: false,
            zoning_checked: false,
            report_generated: false,
            completed: false
          }
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error submitting property request:', insertError);
        toast.error("Failed to submit property request");
        return;
      }

      console.log("Property request submitted:", insertedRequest);
      setCurrentRequestId(insertedRequest.id);
      toast.success("Property request submitted successfully!");
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("There was an error processing your request");
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
      <div className="container mx-auto pt-24 px-4">
        {/* Hero Section */}
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's Generate Your Building Analysis Report
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get your detailed zoning analysis, feasibility reports, and maximum buildable area calculations at a fraction of the cost.
          </p>
        </section>

        {/* Form and Status Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {!currentRequestId ? (
              <AddressForm 
                onSubmit={onSubmit}
                setAutocomplete={setAutocomplete}
                onPlaceSelected={onPlaceSelected}
              />
            ) : (
              <ProcessingStatus requestId={currentRequestId} />
            )}
          </div>
        </div>

        <PricingComparison />
      </div>
    </div>
  );
};

export default GetStarted;