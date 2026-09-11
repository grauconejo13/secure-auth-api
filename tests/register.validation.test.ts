import { describe, expect, it } from "vitest";
import { registerRequestSchema } from "../src/schemas/auth.schema.js";

describe("registration validation", () => {
  it("normalizes a valid email address", () => {
    const result = registerRequestSchema.parse({
      email: "  VANESSA@example.com ",
      password: "Tranquility!2026",
      displayName: "Vanessa"
    });

    expect(result.email).toBe("vanessa@example.com");
  });

  it("rejects a password that is too weak", () => {
    const result = registerRequestSchema.safeParse({
      email: "vanessa@example.com",
      password: "password123!"
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password containing the email name", () => {
    const result = registerRequestSchema.safeParse({
      email: "vanessa@example.com",
      password: "Vanessa!Secure2026"
    });

    expect(result.success).toBe(false);
  });
});
