import { createHash, randomBytes } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { env } from "../config/env.js";
import { userRoles, type UserRole } from "../models/user.model.js";

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const REFRESH_COOKIE_NAME = "refresh_token";

const issuer = "secure-auth-api";
const audience = "secure-auth-api-client";

export interface AccessTokenClaims {
  userId: string;
  role: UserRole;
}

const getAccessTokenSecret = (): Uint8Array => {
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is required before using access tokens.");
  }

  return new TextEncoder().encode(env.JWT_ACCESS_SECRET);
};

export const isAccessTokenConfigured = (): boolean => Boolean(env.JWT_ACCESS_SECRET);

export const createAccessToken = async (
  userId: string,
  role: UserRole
): Promise<string> =>
  new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(getAccessTokenSecret());

export const verifyAccessToken = async (
  token: string
): Promise<AccessTokenClaims> => {
  const { payload } = await jwtVerify(token, getAccessTokenSecret(), {
    algorithms: ["HS256"],
    issuer,
    audience
  });

  const role = payload.role;

  if (
    !payload.sub ||
    typeof role !== "string" ||
    !userRoles.includes(role as UserRole)
  ) {
    throw new Error("Access token is missing required claims.");
  }

  return {
    userId: payload.sub,
    role: role as UserRole
  };
};

export const createRefreshToken = (): string => randomBytes(48).toString("base64url");

export const hashRefreshToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");
