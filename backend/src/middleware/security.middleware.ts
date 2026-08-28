import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config/env.js';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Handled per-environment if required
  crossOriginEmbedderPolicy: false,
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow local development and exact origin match
    if (!origin || origin === env.ALLOWED_ORIGIN || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS security policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Admin-Key', 'X-Session-Id'],
});
