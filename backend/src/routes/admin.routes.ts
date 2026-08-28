import { Router, Request, Response, NextFunction } from "express";
import { getAdminStatus } from "../controllers/admin.controller.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";

export const adminRouter = Router();

function adminAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const incomingKey = req.headers["x-admin-key"];
  if (!incomingKey || incomingKey !== env.ADMIN_API_KEY) {
    return next(
      new AppError(
        "Unauthorized access to administrative endpoint",
        401,
        "UNAUTHORIZED",
      ),
    );
  }
  next();
}

adminRouter.get("/admin/status", adminAuthMiddleware, getAdminStatus);
