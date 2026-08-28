export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CONCURRENT_REQUEST_LIMIT'
  | 'SESSION_NOT_FOUND'
  | 'SESSION_EXPIRED'
  | 'SESSION_BUDGET_EXCEEDED'
  | 'GLOBAL_BUDGET_EXCEEDED'
  | 'TOPIC_RESTRICTED'
  | 'PROMPT_INJECTION_DETECTED'
  | 'PROVIDER_ERROR'
  | 'PROVIDER_TIMEOUT'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR'
  | 'UNAUTHORIZED';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code: ErrorCode = 'INTERNAL_SERVER_ERROR', details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please slow down') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export class ConcurrentRequestError extends AppError {
  constructor(message = 'An AI request is already in progress for this session') {
    super(message, 409, 'CONCURRENT_REQUEST_LIMIT');
  }
}

export class SessionError extends AppError {
  constructor(message = 'Session invalid or expired', statusCode = 401, code: ErrorCode = 'SESSION_NOT_FOUND') {
    super(message, statusCode, code);
  }
}

export class BudgetExceededError extends AppError {
  constructor(message = 'AI demo budget limit reached for this session', code: ErrorCode = 'SESSION_BUDGET_EXCEEDED') {
    super(message, 429, code);
  }
}

export class GuardrailError extends AppError {
  constructor(message: string, code: ErrorCode = 'TOPIC_RESTRICTED') {
    super(message, 400, code);
  }
}

export class ProviderError extends AppError {
  constructor(message = 'AI Provider error occurred', statusCode = 502, code: ErrorCode = 'PROVIDER_ERROR') {
    super(message, statusCode, code);
  }
}
