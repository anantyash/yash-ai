import { Request, Response, NextFunction } from 'express';
import { askRequestSchema } from '../schemas/ask.schema.js';
import { askService } from '../services/ask/ask.service.js';
import { SessionRecord } from '../repositories/session.repository.js';
import { ValidationError, SessionError } from '../utils/errors.js';

export async function handleAsk(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = (req.sessionRecord || (req as any).session) as SessionRecord | undefined;
    if (!session) {
      throw new SessionError('Session is missing or expired. Please initialize a session.');
    }

    const parseResult = askRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError('Invalid question request', parseResult.error.format());
    }

    const requestId = String(req.id || 'req_' + Date.now());
    const result = await askService.processQuestion(parseResult.data, session, requestId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
