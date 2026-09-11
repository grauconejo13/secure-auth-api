import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-at-least-32-characters";
});

import {
  requireAuth,
  requireRole
} from "../src/middleware/auth.middleware.js";
import { createAccessToken } from "../src/services/token.service.js";

describe("access-token middleware", () => {
  it("rejects a request without a Bearer token", async () => {
    const app = express();
    app.get("/protected", requireAuth, (_request, response) =>
      response.status(204).end()
    );

    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("allows a valid signed access token", async () => {
    const app = express();
    app.get("/protected", requireAuth, (request, response) =>
      response.status(200).json({ data: request.auth })
    );
    const token = await createAccessToken("user-123", "user");

    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ userId: "user-123", role: "user" });
  });

  it("blocks a user token from an admin-only route", async () => {
    const app = express();
    app.get(
      "/admin",
      requireAuth,
      requireRole("admin"),
      (_request, response) => response.status(204).end()
    );
    const token = await createAccessToken("user-123", "user");

    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });
});
