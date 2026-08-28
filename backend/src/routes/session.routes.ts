import { Router } from "express";
import { createSession } from "../controllers/session.controller.js";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware.js";

export const sessionRouter = Router();

// Create new anonymous session with rate limiting
sessionRouter.post("/session", rateLimitMiddleware, createSession);
