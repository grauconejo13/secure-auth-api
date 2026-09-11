import bcrypt from "bcryptjs";
import type { RequestHandler, Response } from "express";
import { isDatabaseConnected } from "../config/database.js";
import { User } from "../models/user.model.js";
import {
  loginRequestSchema,
  registerRequestSchema
} from "../schemas/auth.schema.js";
import {
  clearRefreshCookie,
  readRefreshToken,
  setRefreshCookie
} from "../services/auth-cookie.service.js";
import {
  createRefreshSession,
  revokeRefreshSession,
  revokeSessionFamily,
  rotateRefreshSession
} from "../services/session.service.js";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  createAccessToken,
  isAccessTokenConfigured
} from "../services/token.service.js";

const PASSWORD_HASH_ROUNDS = 12;

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: unknown }).code === 11000;

const sendInvalidCredentials = (response: Response) =>
  response.status(401).json({
    error: {
      code: "INVALID_CREDENTIALS",
      message: "Email or password is incorrect."
    }
  });

const sendRefreshTokenError = (
  response: Response,
  code: "INVALID_REFRESH_TOKEN" | "REFRESH_TOKEN_REUSED"
) => {
  clearRefreshCookie(response);

  return response.status(401).json({
    error: {
      code,
      message: "Your session has expired. Please sign in again."
    }
  });
};

const sendAuthenticatedUser = async (
  response: Response,
  user: InstanceType<typeof User>,
  refreshToken: string,
  refreshExpiresAt: Date
) => {
  const accessToken = await createAccessToken(user.id, user.role);
  setRefreshCookie(response, refreshToken, refreshExpiresAt);

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
      refreshSessionExpiresAt: refreshExpiresAt
    }
  });
};

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

    const { refreshToken, expiresAt } = await createRefreshSession(user._id);

    return sendAuthenticatedUser(response, user, refreshToken, expiresAt);
  } catch (error) {
    return next(error);
  }
};

export const refresh: RequestHandler = async (request, response, next) => {
  if (!isDatabaseConnected() || !isAccessTokenConfigured()) {
    return response.status(503).json({
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Session refresh is temporarily unavailable."
      }
    });
  }

  const refreshToken = readRefreshToken(request);

  if (!refreshToken) {
    return sendRefreshTokenError(response, "INVALID_REFRESH_TOKEN");
  }

  try {
    const rotated = await rotateRefreshSession(refreshToken);

    if (rotated.status === "invalid") {
      return sendRefreshTokenError(response, "INVALID_REFRESH_TOKEN");
    }

    if (rotated.status === "reused") {
      return sendRefreshTokenError(response, "REFRESH_TOKEN_REUSED");
    }

    const user = await User.findById(rotated.userId);

    if (!user) {
      await revokeSessionFamily(rotated.familyId);
      return sendRefreshTokenError(response, "INVALID_REFRESH_TOKEN");
    }

    return sendAuthenticatedUser(
      response,
      user,
      rotated.refreshToken,
      rotated.expiresAt
    );
  } catch (error) {
    return next(error);
  }
};

export const logout: RequestHandler = async (request, response, next) => {
  if (!isDatabaseConnected()) {
    return response.status(503).json({
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Logout is temporarily unavailable."
      }
    });
  }

  try {
    const refreshToken = readRefreshToken(request);

    if (refreshToken) {
      await revokeRefreshSession(refreshToken);
    }

    clearRefreshCookie(response);
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
};
