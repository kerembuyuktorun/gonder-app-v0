import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "min")
    .regex(/^\+?[0-9\s()-]{10,}$/, "format"),
});

export const otpSchema = z.object({
  code: z.string().length(6, "length").regex(/^\d+$/, "digits"),
});

export const emailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetSchema = z
  .object({
    code: z.string().length(6),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "mismatch",
  });

export const personalInfoSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
});

export const organizationSchema = z.object({
  name: z.string().min(2),
});

export const companyTaxSchema = z.object({
  legalName: z.string().min(2),
  taxNumber: z.string().min(10).max(11),
  taxOffice: z.string().min(2),
});
