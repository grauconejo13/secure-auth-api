import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("POST /api/v1/auth/register", () => {
  it("rejects invalid registration details before database work", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "not-an-email",
      password: "too-short"
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.fields.email).toBeDefined();
    expect(response.body.error.fields.password).toBeDefined();
  });

  it("does not expose registration while the database is unavailable", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "vanessa@example.com",
      password: "Tranquility!2026"
    });

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("SERVICE_UNAVAILABLE");
  });
});
