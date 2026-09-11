import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middleware/auth-rate-limit.js";

export const authRouter = Router();

authRouter.use(authRateLimiter);
authRouter.post("/register", register);
authRouter.post("/login", login);
