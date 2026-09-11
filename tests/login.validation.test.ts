import { describe, expect, it } from "vitest";
import { loginRequestSchema } from "../src/schemas/auth.schema.js";

describe("login validation", () => {
  it("normalizes an email without enforcing registration-only password rules", () => {
    const result = loginRequestSchema.parse({
      email: "  VANESSA@example.com ",
      password: "existing-password"
    });

    expect(result.email).toBe("vanessa@example.com");
  });

  it("rejects missing credentials", () => {
    const result = loginRequestSchema.safeParse({
      email: "vanessa@example.com",
      password: ""
    });

    expect(result.success).toBe(false);
  });
});
