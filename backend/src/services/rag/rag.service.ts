import {
  RagRequest,
  RagResponse,
  RagSource,
} from "../../schemas/rag.schema.js";
import {
  SessionRecord,
  sessionRepository,
} from "../../repositories/session.repository.js";
import { InjectionGuard } from "../guardrails/injection.guard.js";
import { retrievalService } from "./retrieval.service.js";
import { openaiService } from "../ai/openai.service.js";
import { RAG_SYSTEM_PROMPT } from "../../prompts/rag-system.prompt.js";
import { budgetService } from "../budget/budget.service.js";
import { reservationService } from "../budget/reservation.service.js";
import { estimateTokens } from "../budget/token-estimator.js";
import { usageRepository } from "../../repositories/usage.repository.js";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

export class RagService {
  async processQuery(
    req: RagRequest,
    session: SessionRecord,
    requestId: string,
  ): Promise<RagResponse> {
    const startTime = Date.now();
    const question = req.question.trim();

    // 1. Guardrail Check
    InjectionGuard.validate(question);

    // 2. Estimate token budget for retrieval & generation
    const estimatedTokens =
      estimateTokens(question) + 1200 + env.RAG_MAX_OUTPUT_TOKENS;
    await budgetService.checkAndReserveTokens(session, "rag", estimatedTokens);

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      env.REQUEST_TIMEOUT_MS,
    );

    try {
      // 3. Retrieve matching vector chunks from pgvector
      const { chunks } = await retrievalService.retrieveContext(
        question,
        req.topK || env.RAG_TOP_K,
      );

      let answer = "";
      let inputTokens = 0;
      let outputTokens = 0;
      let totalTokens = 0;

      // Format sources
      const sources: RagSource[] = chunks.map((c) => ({
        documentId: c.documentId,
        title: c.title,
        score: c.score,
        source: c.source,
        content: c.content,
      }));

      if (chunks.length === 0) {
        // Fallback: No matching document met threshold
        answer =
          "I searched the portfolio documentation, but no closely matching reference materials were found for this query. Feel free to ask about Yash’s AI projects (MixChAI, DevBot), DigiCrow experience, or technical stack.";
        inputTokens = estimateTokens(question);
        outputTokens = estimateTokens(answer);
        totalTokens = inputTokens + outputTokens;
      } else {
        // 4. Assemble context data block
        const contextText = chunks
          .map(
            (c, i) =>
              `[SOURCE ${i + 1}: ${c.title} (Similarity: ${(c.score * 100).toFixed(0)}%)]\n${c.content}`,
          )
          .join("\n\n---\n\n");

        // 5. Generate with OpenAI gpt-4o-mini
        const result = await openaiService.generate({
          systemPrompt: RAG_SYSTEM_PROMPT,
          context: contextText,
          userPrompt: question,
          maxTokens: env.RAG_MAX_OUTPUT_TOKENS,
          signal: controller.signal,
        });

        answer = result.text;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;
        totalTokens = result.totalTokens;
      }

      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      // 6. Reconcile Token Reservations
      await reservationService.reconcileTokens(estimatedTokens, totalTokens);

      // 7. Update Session Quota
      const updatedSession = await sessionRepository.incrementUsage(
        session.id,
        "rag",
        totalTokens,
      );

      // 8. Audit Logging
      await usageRepository.recordUsage({
        requestId,
        sessionId: session.id,
        service: "rag",
        provider: "openai",
        model: env.RAG_CHAT_MODEL,
        inputTokens,
        outputTokens,
        totalTokens,
        cacheHit: false,
        status: "success",
        latencyMs,
      });

      const questionsRemaining = updatedSession
        ? env.RAG_SESSION_LIMIT - updatedSession.rag_questions
        : 0;
      const tokensRemaining = updatedSession
        ? env.RAG_SESSION_TOKEN_BUDGET - updatedSession.rag_tokens
        : 0;

      return {
        answer,
        service: "rag",
        provider: "openai",
        model: env.RAG_CHAT_MODEL,
        sources,
        usage: { inputTokens, outputTokens, totalTokens },
        cacheHit: false,
        limits: {
          questionsRemaining: Math.max(0, questionsRemaining),
          tokensRemaining: Math.max(0, tokensRemaining),
        },
      };
    } catch (error: any) {
      clearTimeout(timeout);
      await reservationService.releaseReservation(estimatedTokens);

      await usageRepository.recordUsage({
        requestId,
        sessionId: session.id,
        service: "rag",
        provider: "openai",
        model: env.RAG_CHAT_MODEL,
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

export const ragService = new RagService();
