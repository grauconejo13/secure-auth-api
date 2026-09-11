import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { isDatabaseConnected } from "../config/database.js";
import { User } from "../models/user.model.js";
import { registerRequestSchema } from "../schemas/auth.schema.js";

const PASSWORD_HASH_ROUNDS = 12;

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: unknown }).code === 11000;

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
