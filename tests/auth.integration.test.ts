import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.NODE_ENV = "test";
  process.env.JWT_ACCESS_SECRET =
    "test-access-secret-that-is-at-least-32-characters";
});

import { app } from "../src/app.js";

let mongoServer: MongoMemoryServer;

const credentials = {
  email: "vanessa@example.com",
  password: "Tranquility!2026",
  displayName: "Vanessa"
};

const extractCookie = (response: request.Response): string => {
  const cookie = response.headers["set-cookie"]?.[0];

  if (!cookie) {
    throw new Error("Expected a refresh cookie.");
  }

  return cookie.split(";")[0] ?? "";
};

describe("database-backed authentication flow", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }, 60_000);

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("registers, authenticates, rotates, detects replay, and logs out", async () => {
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(credentials);

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data).toMatchObject({
      email: credentials.email,
      role: "user"
    });

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: credentials.email,
        password: credentials.password
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.accessToken).toEqual(expect.any(String));
    const originalRefreshCookie = extractCookie(loginResponse);

    const profileResponse = await request(app)
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${loginResponse.body.data.accessToken}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.data).toMatchObject({
      email: credentials.email,
      role: "user"
    });

    const rotatedResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", originalRefreshCookie);

    expect(rotatedResponse.status).toBe(200);
    expect(rotatedResponse.body.data.accessToken).toEqual(expect.any(String));
    const rotatedRefreshCookie = extractCookie(rotatedResponse);

    const replayResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", originalRefreshCookie);

    expect(replayResponse.status).toBe(401);
    expect(replayResponse.body.error.code).toBe("REFRESH_TOKEN_REUSED");

    const revokedFamilyResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", rotatedRefreshCookie);

    expect(revokedFamilyResponse.status).toBe(401);
    expect(revokedFamilyResponse.body.error.code).toBe("INVALID_REFRESH_TOKEN");

    const secondLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: credentials.email,
        password: credentials.password
      });

    expect(secondLogin.status).toBe(200);
    const secondRefreshCookie = extractCookie(secondLogin);

    const logoutResponse = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", secondRefreshCookie);

    expect(logoutResponse.status).toBe(204);

    const postLogoutRefresh = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", secondRefreshCookie);

    expect(postLogoutRefresh.status).toBe(401);
    expect(postLogoutRefresh.body.error.code).toBe("INVALID_REFRESH_TOKEN");
  }, 60_000);
});
