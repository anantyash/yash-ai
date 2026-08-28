import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  RateLimitError,
  ConcurrentRequestError,
  SessionError,
  BudgetExceededError,
  GuardrailError,
  ProviderError,
} from '../../src/utils/errors.js';

describe('Error Hierarchy', () => {
  it('should instantiate ValidationError with 400 status', () => {
    const err = new ValidationError('Invalid input data', { field: 'question' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.details).toEqual({ field: 'question' });
    expect(err.isOperational).toBe(true);
  });

  it('should instantiate RateLimitError with 429 status', () => {
    const err = new RateLimitError();
    expect(err.statusCode).toBe(429);
    expect(err.code).toBe('RATE_LIMIT_EXCEEDED');
  });

  it('should instantiate ConcurrentRequestError with 409 status', () => {
    const err = new ConcurrentRequestError();
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONCURRENT_REQUEST_LIMIT');
  });

  it('should instantiate SessionError with 401 status', () => {
    const err = new SessionError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('SESSION_NOT_FOUND');
  });

  it('should instantiate BudgetExceededError with 429 status', () => {
    const err = new BudgetExceededError();
    expect(err.statusCode).toBe(429);
    expect(err.code).toBe('SESSION_BUDGET_EXCEEDED');
  });

  it('should instantiate GuardrailError with 400 status and code', () => {
    const err = new GuardrailError('Out of scope', 'TOPIC_RESTRICTED');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TOPIC_RESTRICTED');
  });

  it('should instantiate ProviderError with 502 status', () => {
    const err = new ProviderError('Upstream Gemini failure');
    expect(err.statusCode).toBe(502);
    expect(err.code).toBe('PROVIDER_ERROR');
  });
});
