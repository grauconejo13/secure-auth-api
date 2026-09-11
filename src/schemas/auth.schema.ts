import { Buffer } from "node:buffer";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .max(254)
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters.")
  .max(72, "Password must be at most 72 characters.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a symbol.")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Password must be at most 72 bytes."
  );

export const registerRequestSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    displayName: z.string().trim().min(1).max(80).optional()
  })
  .superRefine(({ email, password }, context) => {
    const emailPrefix = email.split("@")[0];

    if (emailPrefix && password.toLowerCase().includes(emailPrefix)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must not contain the email name."
      });
    }
  });

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required.")
    .max(72, "Password is too long.")
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Password is too long."
    )
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
