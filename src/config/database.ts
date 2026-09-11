import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  if (!env.MONGODB_URI) {
    if (env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is required in production.");
    }

    console.warn("MONGODB_URI is not set. Database-backed endpoints will return 503.");
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
  console.info("Connected to MongoDB.");
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export const isDatabaseConnected = (): boolean => mongoose.connection.readyState === 1;
