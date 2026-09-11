import type { Server } from "node:http";
import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

let server: Server | undefined;

const start = async (): Promise<void> => {
  await connectDatabase();

  server = app.listen(env.PORT, () => {
    console.info(`secure-auth-api listening on port ${env.PORT}`);
  });
};

const shutdown = async (signal: string): Promise<void> => {
  console.info(`${signal} received. Closing server gracefully.`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => (error ? reject(error) : resolve()));
      });
    }

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Failed to close server cleanly:", error);
    process.exit(1);
  }
};

void start().catch((error: unknown) => {
  console.error("Unable to start secure-auth-api:", error);
  process.exit(1);
});

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
