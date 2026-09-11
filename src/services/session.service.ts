import type { Types } from "mongoose";
import { Session } from "../models/session.model.js";
import {
  createRefreshToken,
  hashRefreshToken,
  REFRESH_SESSION_TTL_MS
} from "./token.service.js";

export interface CreatedSession {
  refreshToken: string;
  expiresAt: Date;
}

export const createRefreshSession = async (
  userId: Types.ObjectId
): Promise<CreatedSession> => {
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_SESSION_TTL_MS);

  await Session.create({
    userId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt
  });

  return { refreshToken, expiresAt };
};
