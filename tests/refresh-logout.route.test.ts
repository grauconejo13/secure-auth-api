import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("refresh and logout route boundaries", () => {
  it("does not refresh a session while required services are unavailable", async () => {
    const response = await request(app).post("/api/v1/auth/refresh");

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("SERVICE_UNAVAILABLE");
  });

  it("does not claim logout succeeded while the session store is unavailable", async () => {
    const response = await request(app).post("/api/v1/auth/logout");

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("SERVICE_UNAVAILABLE");
  });
});
