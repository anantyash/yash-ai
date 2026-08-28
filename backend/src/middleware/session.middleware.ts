import { Request, Response, NextFunction } from 'express';
import { sessionRepository, SessionRecord } from '../repositories/session.repository.js';
import { SessionError, ConcurrentRequestError, ValidationError } from '../utils/errors.js';
import { redis } from '../services/cache/redis.service.js';
import { uuidSchema } from '../schemas/common.schema.js';

declare global {
  namespace Express {
    interface Request {
      sessionRecord?: SessionRecord;
    }
  }
}

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const incomingId = (req.headers['x-session-id'] as string) || req.body?.sessionId;

  if (!incomingId) {
    return next(new ValidationError('Session ID is required via X-Session-Id header or body'));
  }

  const parsedUuid = uuidSchema.safeParse(incomingId);
  if (!parsedUuid.success) {
    return next(new ValidationError('Invalid session ID format'));
  }

  const sessionId = parsedUuid.data;

  try {
    const session = await sessionRepository.getSessionById(sessionId);
    if (!session) {
      return next(new SessionError('Active session not found or has expired. Please create a new session.'));
    }

    // Single active request concurrency lock in Redis (Auto-expire in 30 seconds)
    const lockKey = `lock:session:${sessionId}`;
    const acquired = await redis.set(lockKey, '1', 'EX', 30, 'NX');

    if (!acquired) {
      return next(new ConcurrentRequestError());
    }

    // Attach session record to request
    req.sessionRecord = session;

    // Release lock upon response completion or error
    const releaseLock = async () => {
      try {
        await redis.del(lockKey);
      } catch {
        // Ignore lock release errors
      }
    };

    res.on('finish', releaseLock);
    res.on('close', releaseLock);

    next();
  } catch (error) {
    next(error);
  }
}
