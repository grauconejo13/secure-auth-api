import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "secure-auth-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime())
  });
});
