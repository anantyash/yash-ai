import { Router } from "express";
import { handleRagQuery } from "../controllers/rag.controller.js";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware.js";
import { sessionMiddleware } from "../middleware/session.middleware.js";

export const ragRouter = Router();

ragRouter.post(
  "/rag/query",
  rateLimitMiddleware,
  sessionMiddleware,
  handleRagQuery,
);
