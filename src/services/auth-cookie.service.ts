import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { REFRESH_COOKIE_NAME } from "./token.service.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/v1/auth"
};

export const readRefreshToken = (request: Request): string | undefined => {
  const value = request.cookies?.[REFRESH_COOKIE_NAME];

  return typeof value === "string" && value.length > 0 ? value : undefined;
};

export const setRefreshCookie = (
  response: Response,
  token: string,
  expiresAt: Date
): void => {
  response.cookie(REFRESH_COOKIE_NAME, token, {
    ...refreshCookieOptions,
    maxAge: Math.max(0, expiresAt.getTime() - Date.now())
  });
};

export const clearRefreshCookie = (response: Response): void => {
  response.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
};
