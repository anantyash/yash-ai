import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = isAppError ? err.message : 'An unexpected server error occurred';

  logger.error(
    {
      requestId: req.id,
      err: {
        name: err.name,
        message: err.message,
        stack: env.NODE_ENV === 'development' ? err.stack : undefined,
      },
      url: req.originalUrl,
      method: req.method,
      statusCode,
      code,
    },
    'Handled API error'
  );

  res.status(statusCode).json({
    error: {
      code,
      message,
      requestId: req.id,
      details: isAppError && err.details ? err.details : undefined,
    },
  });
}
