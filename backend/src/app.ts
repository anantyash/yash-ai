import express, { Express } from 'express';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger.js';
import { requestIdMiddleware } from './middleware/request-id.middleware.js';
import { helmetMiddleware, corsMiddleware } from './middleware/security.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';

// Route Handlers
import { healthRouter } from './routes/health.routes.js';
import { sessionRouter } from './routes/session.routes.js';
import { askRouter } from './routes/ask.routes.js';
import { ragRouter } from './routes/rag.routes.js';
import { adminRouter } from './routes/admin.routes.js';

export function createApp(): Express {
  const app = express();

  // 1. Request ID Tagging & Performance Timing
  app.use(requestIdMiddleware);

  // 2. Security Headers & CORS
  app.use(helmetMiddleware);
  app.use(corsMiddleware);

  // 3. Request Logging with Sensitive Data Redaction
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as any).id,
      autoLogging: {
        ignore: (req) => req.url === '/api/health',
      },
    })
  );

  // 4. Body Parsing with Strict 10kb Limit to Prevent Abuse
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // 5. API Routes
  app.use('/api', healthRouter);
  app.use('/api', sessionRouter);
  app.use('/api', askRouter);
  app.use('/api', ragRouter);
  app.use('/api', adminRouter);

  // 6. Centralized Error Handler (Fail Closed, No Leaked Secrets)
  app.use(errorMiddleware);

  return app;
}
