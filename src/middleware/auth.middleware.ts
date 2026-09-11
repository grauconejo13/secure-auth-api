import type { RequestHandler } from "express";
import type { UserRole } from "../models/user.model.js";
import {
  isAccessTokenConfigured,
  verifyAccessToken
} from "../services/token.service.js";

const sendUnauthorized = (response: Parameters<RequestHandler>[1]) =>
  response.status(401).json({
    error: {
      code: "UNAUTHORIZED",
      message: "A valid access token is required."
    }
  });

export const requireAuth: RequestHandler = async (request, response, next) => {
  if (!isAccessTokenConfigured()) {
    return response.status(503).json({
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Authentication is temporarily unavailable."
      }
    });
  }

  const authorization = request.header("authorization");
  const match = authorization ? /^Bearer\s+(.+)$/i.exec(authorization) : null;
  const token = match?.[1];

  if (!token) {
    return sendUnauthorized(response);
  }

  try {
    request.auth = await verifyAccessToken(token);
    return next();
  } catch {
    return sendUnauthorized(response);
  }
};

export const requireRole =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (request, response, next) => {
    if (!request.auth) {
      return sendUnauthorized(response);
    }

    if (!allowedRoles.includes(request.auth.role)) {
      return response.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to access this resource."
        }
      });
    }

    return next();
  };
