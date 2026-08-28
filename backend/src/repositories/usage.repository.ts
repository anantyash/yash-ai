import { pool } from "../db/client.js";
import { v4 as uuidv4 } from "uuid";

export interface UsageLogInput {
  requestId: string;
  sessionId?: string;
  service: "ask" | "rag";
  provider: "gemini" | "openai";
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cacheHit?: boolean;
  status: "success" | "rate_limited" | "budget_exceeded" | "error";
  latencyMs: number;
  errorCode?: string;
}

export class UsageRepository {
  async recordUsage(log: UsageLogInput): Promise<void> {
    const query = `
      INSERT INTO usage_logs (
        id, request_id, session_id, service, provider, model,
        input_tokens, output_tokens, total_tokens, cache_hit,
        status, latency_ms, error_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `;

    const values = [
      uuidv4(),
      log.requestId,
      log.sessionId || null,
      log.service,
      log.provider,
      log.model,
      log.inputTokens,
      log.outputTokens,
      log.totalTokens,
      log.cacheHit || false,
      log.status,
      log.latencyMs,
      log.errorCode || null,
    ];

    try {
      await pool.query(query, values);
    } catch (error) {
      // Non-blocking logger
      console.error("Failed to write usage log to database", error);
    }
  }
}

export const usageRepository = new UsageRepository();
