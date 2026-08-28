import { redis } from '../cache/redis.service.js';
import { env } from '../../config/env.js';
import { BudgetExceededError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

export class ReservationService {
  private getDailyKey(date: Date = new Date()): string {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  async reserveGlobalTokens(estimatedTokens: number): Promise<void> {
    const today = this.getDailyKey();
    const usedKey = `budget:global:${today}:used`;
    const reservedKey = `budget:global:${today}:reserved`;

    const [usedStr, reservedStr] = await Promise.all([
      redis.get(usedKey),
      redis.get(reservedKey),
    ]);

    const used = parseInt(usedStr || '0', 10);
    const reserved = parseInt(reservedStr || '0', 10);

    if (used + reserved + estimatedTokens > env.GLOBAL_DAILY_TOKEN_LIMIT) {
      logger.warn(
        { used, reserved, estimatedTokens, limit: env.GLOBAL_DAILY_TOKEN_LIMIT },
        'Global daily AI token budget reached'
      );
      throw new BudgetExceededError(
        'Global daily AI demonstration budget has been reached. Please check back tomorrow.',
        'GLOBAL_BUDGET_EXCEEDED'
      );
    }

    // Atomically increment reserved tokens with 48h TTL
    await redis.incrby(reservedKey, estimatedTokens);
    await redis.expire(reservedKey, 86400 * 2);
  }

  async reconcileTokens(estimatedTokens: number, actualTokens: number): Promise<void> {
    const today = this.getDailyKey();
    const usedKey = `budget:global:${today}:used`;
    const reservedKey = `budget:global:${today}:reserved`;

    try {
      const pipeline = redis.pipeline();
      // Decrement reserved (clamp to 0 via lua or simple decrby)
      pipeline.decrby(reservedKey, estimatedTokens);
      // Increment actual used
      pipeline.incrby(usedKey, actualTokens);
      pipeline.expire(usedKey, 86400 * 2);
      await pipeline.exec();
    } catch (err) {
      logger.error({ err }, 'Failed to reconcile token budget reservation');
    }
  }

  async releaseReservation(estimatedTokens: number): Promise<void> {
    const today = this.getDailyKey();
    const reservedKey = `budget:global:${today}:reserved`;
    try {
      await redis.decrby(reservedKey, estimatedTokens);
    } catch (err) {
      logger.error({ err }, 'Failed to release token reservation');
    }
  }
}

export const reservationService = new ReservationService();
