export interface SessionLimits {
  askQuestionsRemaining: number;
  ragQuestionsRemaining: number;
  askTokensRemaining: number;
  ragTokensRemaining: number;
}

export interface SessionData {
  sessionId: string;
  expiresAt: string;
  limits: SessionLimits;
}

export interface AskResult {
  answer: string;
  service: 'ask';
  provider: 'gemini';
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  cacheHit: boolean;
  limits: {
    questionsRemaining: number;
    tokensRemaining: number;
  };
}

export interface RagSource {
  documentId: string;
  title: string;
  score: number;
  source: string;
  content: string;
}

export interface RagResult {
  answer: string;
  service: 'rag';
  provider: 'openai';
  model: string;
  sources: RagSource[];
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  cacheHit: boolean;
  limits: {
    questionsRemaining: number;
    tokensRemaining: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  retryAfterSeconds?: number;
}

type LimitsListener = (limits: SessionLimits) => void;

class ApiClient {
  private sessionId: string | null = null;
  private limits: SessionLimits | null = null;
  private sessionPromise: Promise<SessionData> | null = null;
  private activeRequest: boolean = false;
  private lastRequestTime: number = 0;
  private listeners: Set<LimitsListener> = new Set();

  /**
   * Subscribe to live session limits changes.
   */
  subscribeLimits(listener: LimitsListener): () => void {
    this.listeners.add(listener);
    if (this.limits) {
      listener(this.limits);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyLimits(): void {
    if (this.limits) {
      for (const listener of this.listeners) {
        listener(this.limits);
      }
    }
  }

  getCurrentLimits(): SessionLimits | null {
    return this.limits;
  }

  /**
   * Initializes or returns the current active session.
   * Uses Promise deduplication so duplicate concurrent calls (e.g. StrictMode) only send 1 request.
   */
  async getSession(): Promise<SessionData> {
    if (this.sessionId && this.limits) {
      return {
        sessionId: this.sessionId,
        expiresAt: '',
        limits: this.limits,
      };
    }

    if (this.sessionPromise) {
      return this.sessionPromise;
    }

    this.sessionPromise = (async () => {
      const storedId = localStorage.getItem('yash_ai_session_id');

      try {
        const res = await fetch('/api/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(storedId ? { 'X-Session-Id': storedId } : {}),
          },
        });

        if (!res.ok) {
          throw new Error('Failed to initialize session');
        }

        const data: SessionData = await res.json();
        this.sessionId = data.sessionId;
        this.limits = data.limits;
        localStorage.setItem('yash_ai_session_id', data.sessionId);
        this.notifyLimits();
        return data;
      } catch {
        // Safe fallback for local/offline usage
        const fallback: SessionData = {
          sessionId: storedId || 'local-session',
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          limits: {
            askQuestionsRemaining: 8,
            ragQuestionsRemaining: 3,
            askTokensRemaining: 3000,
            ragTokensRemaining: 2500,
          },
        };
        this.sessionId = fallback.sessionId;
        this.limits = fallback.limits;
        this.notifyLimits();
        return fallback;
      } finally {
        this.sessionPromise = null;
      }
    })();

    return this.sessionPromise;
  }

  /**
   * Enforces client-side throttling to prevent accidental spam / duplicate clicks.
   */
  private checkClientThrottle(): void {
    if (this.activeRequest) {
      throw {
        code: 'CONCURRENT_REQUEST',
        message: 'An AI request is already in progress. Please wait a moment.',
      } as ApiError;
    }

    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < 1200) {
      throw {
        code: 'CLIENT_THROTTLE',
        message: 'Please wait a second between queries to avoid exceeding rate limits.',
      } as ApiError;
    }
  }

  async askYash(question: string): Promise<AskResult> {
    this.checkClientThrottle();

    // Client-side quota guard
    if (this.limits && this.limits.askQuestionsRemaining <= 0) {
      throw {
        code: 'SESSION_BUDGET_EXCEEDED',
        message: 'You have reached your Ask Yash question quota for this session (8 questions).',
      } as ApiError;
    }

    this.activeRequest = true;
    this.lastRequestTime = Date.now();

    try {
      const session = await this.getSession();

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': session.sessionId,
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const err: ApiError = errorPayload.error || {
          code: response.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'REQUEST_FAILED',
          message:
            response.status === 429
              ? 'Rate limit exceeded (5 req/min). Please wait 60 seconds.'
              : 'Unable to connect to Ask Yash service. Please check your backend connection.',
          retryAfterSeconds: response.status === 429 ? 60 : undefined,
        };
        throw err;
      }

      const data: AskResult = await response.json();
      if (this.limits) {
        this.limits.askQuestionsRemaining = data.limits.questionsRemaining;
        this.limits.askTokensRemaining = data.limits.tokensRemaining;
        this.notifyLimits();
      }
      return data;
    } finally {
      this.activeRequest = false;
    }
  }

  async queryRag(question: string, topK = 4): Promise<RagResult> {
    this.checkClientThrottle();

    // Client-side quota guard
    if (this.limits && this.limits.ragQuestionsRemaining <= 0) {
      throw {
        code: 'SESSION_BUDGET_EXCEEDED',
        message: 'You have reached your RAG query quota for this session (3 queries).',
      } as ApiError;
    }

    this.activeRequest = true;
    this.lastRequestTime = Date.now();

    try {
      const session = await this.getSession();

      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': session.sessionId,
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          question: question.trim(),
          topK,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const err: ApiError = errorPayload.error || {
          code: response.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'REQUEST_FAILED',
          message:
            response.status === 429
              ? 'Rate limit exceeded (5 req/min). Please wait 60 seconds.'
              : 'Unable to retrieve RAG response. Please check your backend connection.',
          retryAfterSeconds: response.status === 429 ? 60 : undefined,
        };
        throw err;
      }

      const data: RagResult = await response.json();
      if (this.limits) {
        this.limits.ragQuestionsRemaining = data.limits.questionsRemaining;
        this.limits.ragTokensRemaining = data.limits.tokensRemaining;
        this.notifyLimits();
      }
      return data;
    } finally {
      this.activeRequest = false;
    }
  }
}

export const api = new ApiClient();
