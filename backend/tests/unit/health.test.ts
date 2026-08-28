import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import * as dbClient from '../../src/db/client.js';
import * as redisService from '../../src/services/cache/redis.service.js';

describe('Health Endpoint (/api/health)', () => {
  it('should return 200 OK when Postgres and Redis are healthy', async () => {
    vi.spyOn(dbClient, 'checkDatabaseHealth').mockResolvedValue(true);
    vi.spyOn(redisService, 'checkRedisHealth').mockResolvedValue(true);

    const app = createApp();
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.services.postgres).toBe('ok');
    expect(res.body.services.redis).toBe('ok');
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('should return 503 degraded status when Postgres is down', async () => {
    vi.spyOn(dbClient, 'checkDatabaseHealth').mockResolvedValue(false);
    vi.spyOn(redisService, 'checkRedisHealth').mockResolvedValue(true);

    const app = createApp();
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.services.postgres).toBe('error');
    expect(res.body.services.redis).toBe('ok');
  });
});
