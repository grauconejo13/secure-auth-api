import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const userRouter = Router();

userRouter.get("/me", requireAuth, getCurrentUser);
