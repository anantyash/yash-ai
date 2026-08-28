import { Request, Response } from "express";
import { pool } from "../db/client.js";
import { redis } from "../services/cache/redis.service.js";
import { env } from "../config/env.js";

export async function getAdminStatus(
  _req: Request,
  res: Response,
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const usedTokens = await redis.get(`budget:global:${today}:used`);
  const reservedTokens = await redis.get(`budget:global:${today}:reserved`);

  // Count usage logs and sessions from Postgres
  const [sessionCountRes, usageStatsRes] = await Promise.all([
    pool.query("SELECT COUNT(*) AS total FROM sessions;"),
    pool.query(`
      SELECT 
        service,
        COUNT(*) AS total_requests,
        SUM(total_tokens) AS total_tokens,
        AVG(latency_ms)::INT AS avg_latency_ms
      FROM usage_logs
      GROUP BY service;
    `),
  ]);

  res.status(200).json({
    status: "ok",
    environment: env.NODE_ENV,
    switches: {
      askYashEnabled: env.ASK_YASH_ENABLED,
      ragEnabled: env.RAG_ENABLED,
    },
    budgets: {
      globalDailyLimit: env.GLOBAL_DAILY_TOKEN_LIMIT,
      todayUsed: parseInt(usedTokens || "0", 10),
      todayReserved: parseInt(reservedTokens || "0", 10),
    },
    metrics: {
      totalSessions: parseInt(sessionCountRes.rows[0]?.total || "0", 10),
      serviceBreakdown: usageStatsRes.rows,
    },
  });
}
