import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './client.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  const client = await pool.connect();
  try {
    logger.info('Starting database migrations...');
    await client.query('BEGIN');

    for (const file of files) {
      logger.info({ migration: file }, 'Executing migration');
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
    }

    await client.query('COMMIT');
    logger.info('Database migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error({ err: error }, 'Migration failed, transaction rolled back');
    throw error;
  } finally {
    client.release();
  }
}

// Allow direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => {
      logger.info('Migration script finished');
      process.exit(0);
    })
    .catch((err) => {
      logger.error({ err }, 'Migration script exited with error');
      process.exit(1);
    });
}
