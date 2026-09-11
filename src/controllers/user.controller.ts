import type { RequestHandler } from "express";
import { isDatabaseConnected } from "../config/database.js";
import { User } from "../models/user.model.js";

const sendUnavailable = (response: Parameters<RequestHandler>[1]) =>
  response.status(503).json({
    error: {
      code: "SERVICE_UNAVAILABLE",
      message: "User data is temporarily unavailable."
    }
  });

export const getCurrentUser: RequestHandler = async (request, response, next) => {
  if (!request.auth) {
    return response.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "A valid access token is required."
      }
    });
  }

  if (!isDatabaseConnected()) {
    return sendUnavailable(response);
  }

  try {
    const user = await User.findById(request.auth.userId).select(
      "email displayName role createdAt updatedAt"
    );

    if (!user) {
      return response.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "A valid access token is required."
        }
      });
    }

    return response.status(200).json({
      data: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const listUsers: RequestHandler = async (request, response, next) => {
  if (!isDatabaseConnected()) {
    return sendUnavailable(response);
  }

  const requestedLimit = Number(request.query.limit ?? 20);
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 50)
    : 20;

  try {
    const users = await User.find()
      .select("email displayName role createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);

    return response.status(200).json({
      data: users.map((user) => ({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt
      })),
      meta: { limit }
    });
  } catch (error) {
    return next(error);
  }
};
