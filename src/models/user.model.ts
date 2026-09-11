import { Schema, model, models, type HydratedDocument } from "mongoose";

export const userRoles = ["user", "staff", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

export interface UserRecord {
  email: string;
  displayName?: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserRecord>;

const userSchema = new Schema<UserRecord>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 80
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: userRoles,
      default: "user"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = models.User || model<UserRecord>("User", userSchema);
