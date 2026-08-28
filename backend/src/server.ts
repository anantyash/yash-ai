import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { pool } from './db/client.js';
import { redis } from './services/cache/redis.service.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      env: env.NODE_ENV,
      askModel: env.ASK_MODEL,
      ragModel: env.RAG_CHAT_MODEL,
    },
    '🚀 YASH.AI Backend AI Gateway started successfully'
  );
});

// Graceful Shutdown Handler
async function gracefulShutdown(signal: string) {
  logger.info({ signal }, 'Gracefully shutting down server...');

  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await pool.end();
      logger.info('PostgreSQL pool drained');
      await redis.quit();
      logger.info('Redis client disconnected');
    } catch (err) {
      logger.error({ err }, 'Error during resource teardown');
    } finally {
      process.exit(0);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced termination due to timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
