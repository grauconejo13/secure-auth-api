import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.info(`secure-auth-api listening on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.info(`${signal} received. Closing server gracefully.`);

  server.close((error) => {
    if (error) {
      console.error("Failed to close server cleanly:", error);
      process.exit(1);
    }

    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
