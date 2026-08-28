import { Request, Response, NextFunction } from 'express';
import { ragRequestSchema } from '../schemas/rag.schema.js';
import { ragService } from '../services/rag/rag.service.js';
import { SessionRecord } from '../repositories/session.repository.js';
import { ValidationError, SessionError } from '../utils/errors.js';

export async function handleRagQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = (req.sessionRecord || (req as any).session) as SessionRecord | undefined;
    if (!session) {
      throw new SessionError('Session is missing or expired. Please initialize a session.');
    }

    const parseResult = ragRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError('Invalid RAG query request', parseResult.error.format());
    }

    const requestId = String(req.id || 'req_' + Date.now());
    const result = await ragService.processQuery(parseResult.data, session, requestId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
