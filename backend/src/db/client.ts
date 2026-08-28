import pg from 'pg';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected idle PostgreSQL client error');
});

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    logger.warn({ err: error }, 'PostgreSQL health check failed');
    return false;
  }
}
