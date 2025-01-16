import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete } from "@react-google-maps/api";
import { Mic, MicOff, Send } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formSchema } from "./schema";
import { useState } from "react";

interface AddressFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  setAutocomplete: (autocomplete: google.maps.places.Autocomplete | null) => void;
  onPlaceSelected: () => void;
}

export const AddressForm = ({ onSubmit, setAutocomplete, onPlaceSelected }: AddressFormProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onload = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
            const { data, error } = await supabase.functions.invoke('chat-with-ai', {
              body: { 
                audio: base64Audio,
                context: {
                  form_data: form.getValues()
                }
              }
            });

            if (error) throw error;

            if (data.response) {
              form.setValue('description', 
                form.getValues('description') + '\n' + data.response
              );
              
              toast({
                title: "Voice input processed",
                description: "Your message has been added to the description",
              });
            }
          } catch (error) {
            console.error('Error processing voice input:', error);
            toast({
              title: "Error",
              description: "Failed to process voice input. Please try again.",
              variant: "destructive",
            });
          }
        };
        
        reader.readAsDataURL(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak now to add to your property description",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setAudioChunks([]);
    }
  };

  const handlePlaceSelected = () => {
    const autocompleteInstance = form.getValues("autocomplete") as unknown as google.maps.places.Autocomplete;
    if (!autocompleteInstance) return;

    const place = autocompleteInstance.getPlace();
    if (place && place.address_components) {
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
      
      form.setValue("streetAddress", fullStreetAddress);
      form.setValue("city", city);
      form.setValue("state", state);
      form.setValue("zipCode", zipCode);
    }
    
    onPlaceSelected();
  };

  return (
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
                  onLoad={(autocomplete) => {
                    setAutocomplete(autocomplete);
                    form.setValue("autocomplete" as any, autocomplete);
                  }}
                  onPlaceChanged={handlePlaceSelected}
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
              <FormLabel>Property Description</FormLabel>
              <div className="relative">
                <FormControl>
                  <Textarea 
                    placeholder="Tell us more about your property and requirements... You can also use voice input!"
                    className="min-h-[100px] pr-24"
                    {...field}
                  />
                </FormControl>
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? "bg-red-100 hover:bg-red-200" : ""}
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Generate Report
        </Button>
      </form>
    </Form>
  );
};
