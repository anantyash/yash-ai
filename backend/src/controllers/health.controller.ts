import { Request, Response } from 'express';
import { checkDatabaseHealth } from '../db/client.js';
import { checkRedisHealth } from '../services/cache/redis.service.js';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const [dbHealthy, redisHealthy] = await Promise.all([
    checkDatabaseHealth(),
    checkRedisHealth(),
  ]);

  const allHealthy = dbHealthy && redisHealthy;

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      api: 'ok',
      postgres: dbHealthy ? 'ok' : 'error',
      redis: redisHealthy ? 'ok' : 'error',
    },
  });
}
