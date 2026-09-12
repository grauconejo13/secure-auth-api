import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("OpenAPI documentation", () => {
  it("serves the current API contract as JSON", async () => {
    const response = await request(app).get("/api/v1/openapi.json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      openapi: "3.0.3",
      info: { title: "Secure Auth API", version: "0.1.0" }
    });
    expect(response.body.paths).toHaveProperty("/auth/login");
    expect(response.body.paths).toHaveProperty("/users/me");
    expect(response.body.paths["/users/me"].get.security).toEqual([
      { bearerAuth: [] }
    ]);
  });

  it("serves the interactive Swagger UI", async () => {
    const response = await request(app).get("/api/v1/docs/");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Secure Auth API Docs");
  });
});
