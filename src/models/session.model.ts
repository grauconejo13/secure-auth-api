import { Schema, Types, model, models, type Model } from "mongoose";

export interface SessionRecord {
  userId: Types.ObjectId;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  revokedAt?: Date;
  replacedByTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<SessionRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    familyId: {
      type: String,
      required: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },
    usedAt: Date,
    revokedAt: Date,
    replacedByTokenHash: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Session: Model<SessionRecord> =
  (models.Session as Model<SessionRecord> | undefined) ??
  model<SessionRecord>("Session", sessionSchema);
