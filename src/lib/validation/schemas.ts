import { z } from "zod";

export const addressSchema = z.object({
  contactName: z.string().min(2),
  phone: z.string().optional(),
  line1: z.string().min(3),
  line2: z.string().optional(),
  district: z.string().optional(),
  city: z.string().min(2),
  postalCode: z.string().optional(),
  country: z.string().min(2),
});

export const phoneSchema = z
  .string()
  .min(10)
  .regex(/^[+\d\s()-]+$/);

export type AddressFormValues = z.infer<typeof addressSchema>;
