import { Router } from "express";
import { listUsers } from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

export const adminRouter = Router();

adminRouter.get("/users", requireAuth, requireRole("admin"), listUsers);
