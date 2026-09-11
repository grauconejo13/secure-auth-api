import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("POST /api/v1/auth/login", () => {
  it("rejects malformed login data", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "not-an-email",
      password: ""
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("does not authenticate while configuration is unavailable", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "vanessa@example.com",
      password: "existing-password"
    });

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("SERVICE_UNAVAILABLE");
  });
});
