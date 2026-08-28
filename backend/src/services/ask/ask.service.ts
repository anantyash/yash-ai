import { AskRequest, AskResponse } from "../../schemas/ask.schema.js";
import {
  SessionRecord,
  sessionRepository,
} from "../../repositories/session.repository.js";
import { InjectionGuard } from "../guardrails/injection.guard.js";
import { TopicGuard } from "../guardrails/topic.guard.js";
import { responseCacheService } from "../cache/response-cache.js";
import { estimateTokens } from "../budget/token-estimator.js";
import { budgetService } from "../budget/budget.service.js";
import { reservationService } from "../budget/reservation.service.js";
import { geminiService } from "../ai/gemini.service.js";
import {
  ASK_YASH_SYSTEM_PROMPT,
  YASH_PORTFOLIO_CONTEXT,
} from "../../prompts/ask-yash.prompt.js";
import { usageRepository } from "../../repositories/usage.repository.js";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";
import { ProviderError } from "../../utils/errors.js";

export class AskService {
  async processQuestion(
    req: AskRequest,
    session: SessionRecord,
    requestId: string,
  ): Promise<AskResponse> {
    const startTime = Date.now();
    const question = req.question.trim();

    // 1. Guardrails: Prompt Injection & Topic Scope
    InjectionGuard.validate(question);
    TopicGuard.validate(question);

    // 2. Cache Lookup (Spend zero tokens on repeated queries)
    const cachedAnswer =
      await responseCacheService.getCachedAskResponse(question);
    if (cachedAnswer) {
      const latencyMs = Date.now() - startTime;
      await usageRepository.recordUsage({
        requestId,
        sessionId: session.id,
        service: "ask",
        provider: "gemini",
        model: env.ASK_MODEL,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        cacheHit: true,
        status: "success",
        latencyMs,
      });

      return {
        answer: cachedAnswer,
        service: "ask",
        provider: "gemini",
        model: env.ASK_MODEL,
        usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        cacheHit: true,
        limits: {
          questionsRemaining: env.ASK_SESSION_LIMIT - session.ask_questions,
          tokensRemaining: env.ASK_SESSION_TOKEN_BUDGET - session.ask_tokens,
        },
      };
    }

    // 3. Token Estimation & Budget Pre-Reservation
    const estimatedInputTokens =
      estimateTokens(question) + estimateTokens(YASH_PORTFOLIO_CONTEXT);
    const estimatedTokens = estimatedInputTokens + env.ASK_MAX_OUTPUT_TOKENS;

    await budgetService.checkAndReserveTokens(session, "ask", estimatedTokens);

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      env.REQUEST_TIMEOUT_MS,
    );

    try {
      // 4. Generate with Gemini
      const result = await geminiService.generate({
        systemPrompt: ASK_YASH_SYSTEM_PROMPT,
        context: YASH_PORTFOLIO_CONTEXT,
        userPrompt: question,
        maxTokens: env.ASK_MAX_OUTPUT_TOKENS,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      // 5. Reconcile Token Reservations
      await reservationService.reconcileTokens(
        estimatedTokens,
        result.totalTokens,
      );

      // 6. Update Session in Database
      const updatedSession = await sessionRepository.incrementUsage(
        session.id,
        "ask",
        result.totalTokens,
      );

      // 7. Write Audit Usage Log
      await usageRepository.recordUsage({
        requestId,
        sessionId: session.id,
        service: "ask",
        provider: "gemini",
        model: env.ASK_MODEL,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        totalTokens: result.totalTokens,
        cacheHit: false,
        status: "success",
        latencyMs,
      });

      // 8. Cache Response
      await responseCacheService.setCachedAskResponse(question, result.text);

      const questionsRemaining = updatedSession
        ? env.ASK_SESSION_LIMIT - updatedSession.ask_questions
        : 0;
      const tokensRemaining = updatedSession
        ? env.ASK_SESSION_TOKEN_BUDGET - updatedSession.ask_tokens
        : 0;

      return {
        answer: result.text,
        service: "ask",
        provider: "gemini",
        model: env.ASK_MODEL,
        usage: {
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
          totalTokens: result.totalTokens,
        },
        cacheHit: false,
        limits: {
          questionsRemaining: Math.max(0, questionsRemaining),
          tokensRemaining: Math.max(0, tokensRemaining),
        },
      };
    } catch (error: any) {
      clearTimeout(timeout);
      // Release reserved tokens in case of error
      await reservationService.releaseReservation(estimatedTokens);

      await usageRepository.recordUsage({
        requestId,
        sessionId: session.id,
        service: "ask",
        provider: "gemini",
        model: env.ASK_MODEL,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        status: "error",
        latencyMs: Date.now() - startTime,
        errorCode: error.code || "PROVIDER_ERROR",
      });

      throw error;
    }
  }
}

export const askService = new AskService();
