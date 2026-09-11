import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import {
  clearRefreshCookie,
  setRefreshCookie
} from "../src/services/auth-cookie.service.js";

describe("refresh cookie configuration", () => {
  it("sets an HttpOnly refresh cookie scoped to auth routes", async () => {
    const app = express();
    app.get("/set-cookie", (_request, response) => {
      setRefreshCookie(response, "raw-refresh-token", new Date(Date.now() + 60_000));
      response.status(204).end();
    });

    const response = await request(app).get("/set-cookie");
    const cookie = response.headers["set-cookie"]?.[0] ?? "";

    expect(cookie).toContain("refresh_token=raw-refresh-token");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Path=/api/v1/auth");
    expect(cookie).toContain("SameSite=Strict");
  });

  it("clears the refresh cookie using the same path", async () => {
    const app = express();
    app.post("/clear-cookie", (_request, response) => {
      clearRefreshCookie(response);
      response.status(204).end();
    });

    const response = await request(app).post("/clear-cookie");
    const cookie = response.headers["set-cookie"]?.[0] ?? "";

    expect(cookie).toContain("refresh_token=");
    expect(cookie).toContain("Path=/api/v1/auth");
  });
});
