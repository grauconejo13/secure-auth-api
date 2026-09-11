import { randomUUID } from "node:crypto";
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
  familyId: string;
}

export type RefreshRotationResult =
  | {
      status: "rotated";
      refreshToken: string;
      expiresAt: Date;
      userId: Types.ObjectId;
      familyId: string;
    }
  | { status: "invalid" }
  | { status: "reused" };

export const createRefreshSession = async (
  userId: Types.ObjectId
): Promise<CreatedSession> => {
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_SESSION_TTL_MS);
  const familyId = randomUUID();

  await Session.create({
    userId,
    familyId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt
  });

  return { refreshToken, expiresAt, familyId };
};

export const rotateRefreshSession = async (
  token: string
): Promise<RefreshRotationResult> => {
  const tokenHash = hashRefreshToken(token);
  const session = await Session.findOne({ tokenHash }).select("+tokenHash");

  if (!session || session.expiresAt <= new Date() || session.revokedAt) {
    return { status: "invalid" };
  }

  if (session.usedAt) {
    await revokeSessionFamily(session.familyId);
    return { status: "reused" };
  }

  const refreshToken = createRefreshToken();
  const nextTokenHash = hashRefreshToken(refreshToken);
  const consumed = await Session.findOneAndUpdate(
    {
      _id: session._id,
      usedAt: { $exists: false },
      revokedAt: { $exists: false }
    },
    {
      $set: {
        usedAt: new Date(),
        replacedByTokenHash: nextTokenHash
      }
    },
    { new: true }
  );

  if (!consumed) {
    await revokeSessionFamily(session.familyId);
    return { status: "reused" };
  }

  await Session.create({
    userId: session.userId,
    familyId: session.familyId,
    tokenHash: nextTokenHash,
    expiresAt: session.expiresAt
  });

  return {
    status: "rotated",
    refreshToken,
    expiresAt: session.expiresAt,
    userId: session.userId,
    familyId: session.familyId
  };
};

export const revokeRefreshSession = async (token: string): Promise<void> => {
  await Session.updateOne(
    {
      tokenHash: hashRefreshToken(token),
      revokedAt: { $exists: false }
    },
    { $set: { revokedAt: new Date() } }
  );
};

export const revokeSessionFamily = async (familyId: string): Promise<void> => {
  await Session.updateMany(
    {
      familyId,
      revokedAt: { $exists: false }
    },
    { $set: { revokedAt: new Date() } }
  );
};
