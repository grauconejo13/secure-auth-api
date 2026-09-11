import { Buffer } from "node:buffer";
import { z } from "zod";

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
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254)
      .transform((email) => email.toLowerCase()),
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

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
