# Architecture: Ask Yash Service

## Purpose & Boundaries

"Ask Yash" is a lightweight, low-latency AI assistant powered by Google Gemini specifically engineered to answer questions regarding Yash's software engineering background and portfolio.

## Technical Safeguards

1. **Zero Secret Leakage**: Browser clients never communicate directly with Gemini; all requests flow through the Node.js / Express AI Gateway where API keys reside solely in environment variables.
2. **Local Guardrails**: InjectionGuard and TopicGuard intercept prompt injection attempts and out-of-scope inquiries before any LLM API calls are made, spending zero provider tokens.
3. **Response Caching**: Responses to frequently asked questions are cached in Redis keyed by normalized SHA-256 hashes with configurable TTLs.
4. **Token Quota Accounting**: Each invocation is validated against request, session, and global daily budgets, with pre-call token reservations and post-call reconciliations.
