import { Schema, Types, model, models, type Model } from "mongoose";

export interface SessionRecord {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
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
    tokenHash: {
      type: String,
      required: true,
      select: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

sessionSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });

export const Session: Model<SessionRecord> =
  (models.Session as Model<SessionRecord> | undefined) ??
  model<SessionRecord>("Session", sessionSchema);
