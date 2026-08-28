import { pool } from '../db/client.js';
import { v4 as uuidv4 } from 'uuid';

export interface SessionRecord {
  id: string;
  ip_hash: string;
  user_agent: string | null;
  ask_questions: number;
  rag_questions: number;
  ask_tokens: number;
  rag_tokens: number;
  active_requests: number;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export class SessionRepository {
  async createSession(ipHash: string, userAgent?: string, ttlHours = 24): Promise<SessionRecord> {
    const id = uuidv4();
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

    const query = `
      INSERT INTO sessions (id, ip_hash, user_agent, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id, ipHash, userAgent || null, expiresAt];
    const { rows } = await pool.query<SessionRecord>(query, values);
    return rows[0];
  }

  async getSessionById(sessionId: string): Promise<SessionRecord | null> {
    const query = `
      SELECT * FROM sessions
      WHERE id = $1 AND expires_at > NOW();
    `;
    const { rows } = await pool.query<SessionRecord>(query, [sessionId]);
    return rows[0] || null;
  }

  async incrementUsage(
    sessionId: string,
    service: 'ask' | 'rag',
    tokensUsed: number
  ): Promise<SessionRecord | null> {
    const questionCol = service === 'ask' ? 'ask_questions' : 'rag_questions';
    const tokenCol = service === 'ask' ? 'ask_tokens' : 'rag_tokens';

    const query = `
      UPDATE sessions
      SET 
        ${questionCol} = ${questionCol} + 1,
        ${tokenCol} = ${tokenCol} + $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query<SessionRecord>(query, [sessionId, tokensUsed]);
    return rows[0] || null;
  }
}

export const sessionRepository = new SessionRepository();
