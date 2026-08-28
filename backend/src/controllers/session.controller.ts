import { Request, Response, NextFunction } from "express";
import { sessionRepository } from "../repositories/session.repository.js";
import { hashIp } from "../utils/normalize.js";
import { env } from "../config/env.js";

export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"];
    const ipHash = hashIp(rawIp);

    const session = await sessionRepository.createSession(ipHash, userAgent);

    res.status(201).json({
      sessionId: session.id,
      expiresAt: session.expires_at.toISOString(),
      limits: {
        askQuestionsRemaining: env.ASK_SESSION_LIMIT - session.ask_questions,
        ragQuestionsRemaining: env.RAG_SESSION_LIMIT - session.rag_questions,
        askTokensRemaining: env.ASK_SESSION_TOKEN_BUDGET - session.ask_tokens,
        ragTokensRemaining: env.RAG_SESSION_TOKEN_BUDGET - session.rag_tokens,
      },
    });
  } catch (error) {
    next(error);
  }
}
