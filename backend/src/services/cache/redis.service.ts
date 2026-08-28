import { Redis } from 'ioredis';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  lazyConnect: true,
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (err) => {
  logger.warn({ err: err.message }, 'Redis connection error');
});

export async function checkRedisHealth(): Promise<boolean> {
  try {
    if (redis.status !== 'ready' && redis.status !== 'connecting') {
      await redis.connect();
    }
    const pong = await redis.ping();
    return pong === 'PONG';
  } catch (error) {
    logger.warn({ err: error }, 'Redis health check failed');
    return false;
  }
}
