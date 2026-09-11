import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { isDatabaseConnected } from "../config/database.js";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import {
  loginRequestSchema,
  registerRequestSchema
} from "../schemas/auth.schema.js";
import { createRefreshSession } from "../services/session.service.js";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  createAccessToken,
  isAccessTokenConfigured,
  REFRESH_COOKIE_NAME,
  REFRESH_SESSION_TTL_MS
} from "../services/token.service.js";

const PASSWORD_HASH_ROUNDS = 12;

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: unknown }).code === 11000;

const sendInvalidCredentials = (response: Parameters<RequestHandler>[1]) =>
  response.status(401).json({
    error: {
      code: "INVALID_CREDENTIALS",
      message: "Email or password is incorrect."
    }
  });

export const register: RequestHandler = async (request, response, next) => {
  const parsed = registerRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Registration details are invalid.",
        fields: parsed.error.flatten().fieldErrors
      }
    });
  }

  if (!isDatabaseConnected()) {
    return response.status(503).json({
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Registration is temporarily unavailable."
      }
    });
  }

  try {
    const { email, password, displayName } = parsed.data;
    const existingUser = await User.exists({ email });

    if (existingUser) {
      return response.status(409).json({
        error: {
          code: "EMAIL_UNAVAILABLE",
          message: "An account cannot be created with these details."
        }
      });
    }

    const passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
    const user = await User.create({
      email,
      passwordHash,
      ...(displayName ? { displayName } : {})
    });

    return response.status(201).json({
      data: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return response.status(409).json({
        error: {
          code: "EMAIL_UNAVAILABLE",
          message: "An account cannot be created with these details."
        }
      });
    }

    return next(error);
  }
};

export const login: RequestHandler = async (request, response, next) => {
  const parsed = loginRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Login details are invalid."
      }
    });
  }

  if (!isDatabaseConnected() || !isAccessTokenConfigured()) {
    return response.status(503).json({
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Login is temporarily unavailable."
      }
    });
  }

  try {
    const { email, password } = parsed.data;
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return sendInvalidCredentials(response);
    }

    const accessToken = await createAccessToken(user.id, user.role);
    const { refreshToken, expiresAt } = await createRefreshSession(user._id);

    response.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/auth",
      maxAge: REFRESH_SESSION_TTL_MS
    });

    return response.status(200).json({
      data: {
        accessToken,
        tokenType: "Bearer",
        expiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role
        },
        refreshSessionExpiresAt: expiresAt
      }
    });
  } catch (error) {
    return next(error);
  }
};
