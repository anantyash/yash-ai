import { Router } from "express";
import { handleAsk } from "../controllers/ask.controller.js";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware.js";
import { sessionMiddleware } from "../middleware/session.middleware.js";

export const askRouter = Router();

askRouter.post("/ask", rateLimitMiddleware, sessionMiddleware, handleAsk);
