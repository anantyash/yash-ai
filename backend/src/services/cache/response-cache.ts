import { redis } from './redis.service.js';
import { normalizeQuestion, hashString } from '../../utils/normalize.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class ResponseCacheService {
  async getCachedAskResponse(question: string): Promise<string | null> {
    const normalized = normalizeQuestion(question);
    const hash = hashString(normalized);
    const key = `cache:ask:${hash}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        logger.info({ hash }, 'Ask Yash cache hit');
        return cached;
      }
    } catch (err) {
      logger.warn({ err }, 'Redis cache read error');
    }
    return null;
  }

  async setCachedAskResponse(question: string, answer: string): Promise<void> {
    const normalized = normalizeQuestion(question);
    const hash = hashString(normalized);
    const key = `cache:ask:${hash}`;

    try {
      await redis.set(key, answer, 'EX', env.CACHE_RESPONSE_TTL_SECONDS);
    } catch (err) {
      logger.warn({ err }, 'Redis cache write error');
    }
  }

  async getCachedEmbedding(text: string): Promise<number[] | null> {
    const normalized = normalizeQuestion(text);
    const hash = hashString(normalized);
    const key = `cache:embed:${hash}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      logger.warn({ err }, 'Redis embedding cache read error');
    }
    return null;
  }

  async setCachedEmbedding(text: string, embedding: number[]): Promise<void> {
    const normalized = normalizeQuestion(text);
    const hash = hashString(normalized);
    const key = `cache:embed:${hash}`;

    try {
      await redis.set(key, JSON.stringify(embedding), 'EX', env.CACHE_EMBEDDING_TTL_SECONDS);
    } catch (err) {
      logger.warn({ err }, 'Redis embedding cache write error');
    }
  }
}

export const responseCacheService = new ResponseCacheService();
