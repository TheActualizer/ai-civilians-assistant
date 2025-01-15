import { z } from "zod";

export const zipCodeRegex = /^\d{5}(-\d{4})?$/;

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().length(2, "Please enter a valid 2-letter state code"),
  zipCode: z.string().regex(zipCodeRegex, "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"),
  description: z.string().optional(),
  autocomplete: z.any().optional(),
});

export type FormValues = z.infer<typeof formSchema>;