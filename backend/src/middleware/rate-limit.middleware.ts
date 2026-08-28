import { Request, Response, NextFunction } from 'express';
import { redis } from '../services/cache/redis.service.js';
import { env } from '../config/env.js';
import { hashIp } from '../utils/normalize.js';
import { RateLimitError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export async function rateLimitMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const rawIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const hashedIp = hashIp(rawIp);
  const key = `ratelimit:ip:${hashedIp}`;

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.pexpire(key, env.RATE_LIMIT_WINDOW_MS);
    }

    if (current > env.RATE_LIMIT_MAX_REQUESTS) {
      logger.warn({ ipHash: hashedIp, current, limit: env.RATE_LIMIT_MAX_REQUESTS }, 'IP rate limit exceeded');
      throw new RateLimitError(
        `Too many requests. Limit is ${env.RATE_LIMIT_MAX_REQUESTS} requests per minute.`
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
