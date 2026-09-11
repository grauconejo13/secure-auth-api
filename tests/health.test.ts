import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("GET /api/v1/health", () => {
  it("returns service health information", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      service: "secure-auth-api"
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
  });
});
