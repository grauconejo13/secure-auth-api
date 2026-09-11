import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createAuthRateLimiter } from "../src/middleware/auth-rate-limit.js";

describe("authentication rate limiter", () => {
  it("blocks the eleventh request in its 15-minute window", async () => {
    const app = express();
    app.use(createAuthRateLimiter());
    app.post("/auth", (_request, response) => response.status(204).end());

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await request(app).post("/auth");
      expect(response.status).toBe(204);
    }

    const blocked = await request(app).post("/auth");

    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe("TOO_MANY_AUTH_ATTEMPTS");
  });
});
