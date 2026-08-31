import { Request, Response, NextFunction } from "express";
import {
  sessionRepository,
  SessionRecord,
} from "../repositories/session.repository.js";
import { hashIp } from "../utils/normalize.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

// UUID validation regex (standard 8-4-4-4-12 hex)
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatSessionResponse(session: SessionRecord) {
  const expiresAt =
    session.expires_at instanceof Date
      ? session.expires_at.toISOString()
      : new Date(session.expires_at).toISOString();

  return {
    sessionId: session.id,
    expiresAt,
    limits: {
      askQuestionsRemaining: Math.max(
        0,
        env.ASK_SESSION_LIMIT - session.ask_questions,
      ),
      ragQuestionsRemaining: Math.max(
        0,
        env.RAG_SESSION_LIMIT - session.rag_questions,
      ),
      askTokensRemaining: Math.max(
        0,
        env.ASK_SESSION_TOKEN_BUDGET - session.ask_tokens,
      ),
      ragTokensRemaining: Math.max(
        0,
        env.RAG_SESSION_TOKEN_BUDGET - session.rag_tokens,
      ),
    },
  };
}

export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"];
    const ipHash = hashIp(rawIp);

    // 1. Check for existing session ID from header, body, or query
    const headerSessionId = req.headers["x-session-id"] as string | undefined;
    const bodySessionId = req.body?.sessionId as string | undefined;
    const querySessionId = req.query?.sessionId as string | undefined;
    const candidateId = (
      headerSessionId ||
      bodySessionId ||
      querySessionId ||
      ""
    ).trim();

    if (candidateId && UUID_REGEX.test(candidateId)) {
      const existingSession =
        await sessionRepository.getSessionById(candidateId);
      if (existingSession) {
        logger.info(
          {
            sessionId: existingSession.id,
            askQuestions: existingSession.ask_questions,
            ragQuestions: existingSession.rag_questions,
            askTokens: existingSession.ask_tokens,
            ragTokens: existingSession.rag_tokens,
          },
          "Reusing existing valid session from database",
        );
        res.status(200).json(formatSessionResponse(existingSession));
        return;
      }
    }

    // 2. If no valid unexpired session was found, create a fresh session
    const session = await sessionRepository.createSession(ipHash, userAgent);
    logger.info({ sessionId: session.id }, "Created new session in database");

    res.status(201).json(formatSessionResponse(session));
  } catch (error) {
    next(error);
  }
}
