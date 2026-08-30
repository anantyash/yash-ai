# YASH.AI — Production AI Gateway & RAG Portfolio System

> **"Turning Intelligence Into Production Software."**  
> An enterprise-grade AI Gateway, Multi-Model Orchestration Platform, and Vector Retrieval-Augmented Generation (RAG) Knowledge Engine powering Yash's Software Engineering Portfolio.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_pgvector-336791.svg)](https://github.com/pgvector/pgvector)
[![Redis](https://img.shields.io/badge/Redis-7.x-dc382d.svg)](https://redis.io/)
[![Vercel AI SDK](https://img.shields.io/badge/AI_SDK-v7-black.svg)](https://sdk.vercel.ai/docs)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-success.svg)](https://vitest.dev/)

---

## 📑 Table of Contents

1. [Executive Summary & Capabilities](#-executive-summary--capabilities)
2. [End-to-End System Architecture](#-end-to-end-system-architecture)
3. [Project File Structure](#-project-file-structure)
4. [How Rate Limiting Works in Detail](#-how-rate-limiting-works-in-detail)
5. [How Redis Works in Detail (Cache, Locks & Token Reservations)](#-how-redis-works-in-detail)
6. [Dual AI Services Deep Dive](#-dual-ai-services-deep-dive)
   - [Service 1: Ask Yash (Google Gemini 3.6 Flash)](#service-1-ask-yash-google-gemini-36-flash)
   - [Service 2: RAG Knowledge Engine (pgvector + gpt-4o-mini)](#service-2-rag-knowledge-engine-pgvector--gpt-4o-mini)
7. [Security & Prompt Injection Defenses](#-security--prompt-injection-defenses)
8. [Frontend Telemetry HUD & Markdown Rendering](#-frontend-telemetry-hud--markdown-rendering)
9. [Database Schema & Migrations](#-database-schema--migrations)
10. [Local Development & Quickstart](#-local-development--quickstart)
11. [Testing & Verification](#-testing--verification)

---

## 🌟 Executive Summary & Capabilities

**YASH.AI** is not a basic portfolio wrapper around an LLM. It is a full-featured, resilient AI Control Plane and Gateway designed with enterprise software engineering standards:

- **Multi-Model Orchestration**: Leverages **Google Gemini 3.6 Flash** for instantaneous portfolio persona chat and **OpenAI `gpt-4o-mini` + `text-embedding-3-small`** for grounded vector document question answering.
- **Vector Knowledge Retrieval**: Uses PostgreSQL 16 with the **`pgvector` extension** to perform cosine similarity lookups over indexed markdown documentation.
- **Cost & Budget Protection**: Implements a strict **Two-Phase Token Reservation & Reconciliation Algorithm** using Redis to protect against runaway API billing.
- **Concurrency & Abuse Safeguards**: Distributed locks, IP-based sliding rate limiters, client-side debounce/cooldown timers, and strict prompt injection scanners.
- **Rich Markdown Synthesis**: Dynamically compiles streaming/JSON markdown outputs with styled headers, bulleted lists, and inline code badges.

---

## 🏛️ End-to-End System Architecture

```
                                 VISITOR BROWSER
                                        │
                                        │ (HTTP / JSON / Vite Proxy)
                                        ▼
             ┌─────────────────────────────────────────────────────────┐
             │               React 18 + Vite + Tailwind                │
             │   - Live Telemetry HUD (Token budget & request meters)  │
             │   - Client-side Throttling (1200ms debounce, cooldown)  │
             │   - MarkdownRenderer Component (Rich styling)           │
             └──────────────────────────┬──────────────────────────────┘
                                        │
                                        ▼
             ┌─────────────────────────────────────────────────────────┐
             │             Production Express.js AI Gateway            │
             │              (TypeScript • Pino Logging)                │
             └──────┬───────────────────┬───────────────────┬──────────┘
                    │                   │                   │
                    ▼                   ▼                   ▼
             ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
             │ Rate Limit  │     │ Session     │     │ Injection   │
             │ (5 req/min) │     │ Middleware  │     │ Guard       │
             └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
                    └───────────────────┼───────────────────┘
                                        │
                                        ▼
             ┌─────────────────────────────────────────────────────────┐
             │              Two-Phase Token Reservation                │
             │   1. Estimate (Prompt + System + Max Output)            │
             │   2. Reserve in Redis (Atomic check against daily cap)  │
             │   3. Validate Session Quotas (PostgreSQL Session)       │
             └──────────────────────────┬──────────────────────────────┘
                                        │
                     ┌──────────────────┴──────────────────┐
                     │                                     │
                     ▼                                     ▼
        ┌─────────────────────────┐           ┌─────────────────────────┐
        │   Service 1: Ask Yash   │           │   Service 2: RAG Engine │
        │   (Google Gemini Flash) │           │   (pgvector + OpenAI)   │
        ├─────────────────────────┤           ├─────────────────────────┤
        │ • Gemini 3.6 Flash      │           │ • text-embedding-3-sm   │
        │ • Vercel AI SDK v7      │           │ • Cosine Match (pgvector│
        │ • Rich System Context   │           │ • Top-4 Context Recall  │
        │ • Redis Response Cache  │           │ • gpt-4o-mini Synthesis │
        └────────────┬────────────┘           └────────────┬────────────┘
                     │                                     │
                     └──────────────────┬──────────────────┘
                                        │
                                        ▼
             ┌─────────────────────────────────────────────────────────┐
             │               Post-Call Reconciliation                  │
             │   1. Deduct actual tokens from Redis reservation        │
             │   2. Record usage into `usage_logs` & `sessions` in DB  │
             │   3. Cache response in Redis for 1 hour                 │
             └──────────────────────────┬──────────────────────────────┘
                                        │
                                        ▼
                               Clean JSON Response
                 (answer, usage, model, sources, sessionLimits)
```

---

## 📂 Project File Structure

```
.
├── backend/                              # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts                    # Zod-validated environment variables & defaults
│   │   ├── controllers/
│   │   │   ├── ask.controller.ts         # Controller for Ask Yash service
│   │   │   ├── rag.controller.ts         # Controller for RAG query and ingestion
│   │   │   ├── session.controller.ts     # Controller for anonymous session creation
│   │   │   └── health.controller.ts      # Health probe (DB, Redis, API status)
│   │   ├── db/
│   │   │   ├── client.ts                 # PostgreSQL connection pool
│   │   │   ├── migrate.ts                # Migration runner script
│   │   │   └── migrations/               # SQL DDL schemas (pgvector, tables, indexes)
│   │   │       ├── 001_initial_schema.sql
│   │   │       └── 002_vector_index.sql
│   │   ├── middleware/
│   │   │   ├── rate-limiter.ts           # Redis-backed sliding window IP rate limiter
│   │   │   ├── session.middleware.ts     # Anonymous session resolver & validator
│   │   │   ├── error-handler.ts          # Centralized error formatter
│   │   │   └── request-id.ts             # UUID request-id telemetry injector
│   │   ├── prompts/
│   │   │   ├── ask-yash.prompt.ts        # Gemini 3.6 Flash persona & portfolio prompt
│   │   │   └── rag-system.prompt.ts      # RAG grounded synthesis prompt
│   │   ├── repositories/
│   │   │   ├── session.repository.ts     # PostgreSQL session CRUD
│   │   │   ├── usage.repository.ts       # PostgreSQL token & latency telemetry logger
│   │   │   └── vector.repository.ts      # PostgreSQL pgvector similarity query executor
│   │   ├── routes/
│   │   │   ├── ask.routes.ts             # POST /api/ask
│   │   │   ├── rag.routes.ts             # POST /api/rag/query, POST /api/rag/ingest
│   │   │   ├── session.routes.ts         # POST /api/session
│   │   │   ├── health.routes.ts          # GET /api/health
│   │   │   └── index.ts                  # Consolidated API router
│   │   ├── schemas/
│   │   │   ├── ask.schema.ts             # Zod input/output contracts for Ask Yash
│   │   │   ├── rag.schema.ts             # Zod contracts for RAG query & ingestion
│   │   │   └── session.schema.ts         # Zod contracts for Session initialization
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── gemini.service.ts     # Vercel AI SDK Google Gemini provider
│   │   │   │   ├── openai.service.ts     # Vercel AI SDK OpenAI provider (embeddings & chat)
│   │   │   │   └── ai.types.ts           # Unified provider interfaces
│   │   │   ├── ask/
│   │   │   │   └── ask.service.ts        # Orchestration pipeline for Ask Yash
│   │   │   ├── budget/
│   │   │   │   ├── budget.service.ts     # Session budget limits validation
│   │   │   │   ├── reservation.service.ts# Redis token reservation & reconciliation
│   │   │   │   └── token-estimator.ts    # Fast character-based token estimator
│   │   │   ├── cache/
│   │   │   │   ├── redis.service.ts      # ioredis connection client
│   │   │   │   └── response-cache.ts     # SHA-256 hashed response & embedding caching
│   │   │   ├── rag/
│   │   │   │   ├── ingestion.service.ts  # Markdown parsing, heading-merge chunker
│   │   │   │   ├── retrieval.service.ts  # Cosine vector retrieval from pgvector
│   │   │   │   └── rag.service.ts        # RAG prompt generation and synthesis
│   │   │   └── security/
│   │   │       ├── injection-guard.ts    # Prompt injection heuristic analyzer
│   │   │       └── topic-guard.ts        # Out-of-bounds query classifier
│   │   ├── utils/
│   │   │   ├── errors.ts                 # Typed AppError classes (RateLimit, Budget, etc.)
│   │   │   ├── logger.ts                 # Pino structured JSON logger
│   │   │   └── normalize.ts              # Query trimming, lowercase, SHA-256 hashing
│   │   ├── app.ts                        # Express application setup
│   │   └── index.ts                      # Server bootstrap
│   ├── scripts/
│   │   └── ingest-knowledge.ts           # Batch ingestion CLI for knowledge base
│   └── tests/                            # Vitest unit test suite
│       └── unit/
│           ├── api.test.ts               # End-to-end controller tests
│           ├── errors.test.ts            # Error hierarchy tests
│           ├── health.test.ts            # Health route tests
│           ├── injection-guard.test.ts   # Security guard tests
│           ├── normalize.test.ts         # Normalization & hashing tests
│           ├── token-estimator.test.ts   # Token estimator tests
│           └── topic-guard.test.ts       # Topic classifier tests
│
├── frontend/                             # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AILab.tsx                 # Interactive Playground with Telemetry HUD
│   │   │   ├── MarkdownRenderer.tsx      # Semantic ReactMarkdown display component
│   │   │   ├── Hero.tsx                  # Hero section with live badges & status
│   │   │   ├── FeaturedProjects.tsx      # Showcase of MixChAI, DevBot, and YASH.AI
│   │   │   ├── Experience.tsx            # DigiCrow experience timeline
│   │   │   ├── Skills.tsx                # Technical skill inventory
│   │   │   ├── Contact.tsx               # Contact form and links
│   │   │   └── Navbar.tsx / Footer.tsx   # Navigation and status footer
│   │   ├── lib/
│   │   │   ├── api.ts                    # Relative API client with throttle protection
│   │   │   └── utils.ts                  # Tailwind clsx/twMerge utilities
│   │   ├── data/
│   │   │   └── portfolioData.ts          # Static content definitions
│   │   ├── App.tsx                       # Main React view layout
│   │   ├── main.tsx                      # React root mount point
│   │   └── index.css                     # Tailwind CSS & glassmorphism definitions
│   ├── vite.config.ts                    # Vite config with backend proxy (`/api` -> 4000)
│   └── package.json
│
├── knowledge/                            # Canonical Markdown Documents for Vector Store
│   ├── profile.md                        # Master bio, contact, and core projects
│   ├── experience.md                     # DigiCrow Web Development responsibilities
│   ├── education.md                      # B.Tech CSE details and coursework
│   ├── projects/
│   │   ├── mixchai.md                    # MixChAI architecture and consensus algorithm
│   │   ├── devbot.md                     # DevBot persona system design
│   │   └── yash_ai_gateway.md            # YASH.AI architecture and security model
│   └── architecture/
│       └── token_reservation.md          # Formal Token Reservation & Reconciliation specs
│
├── docker-compose.yml                    # PostgreSQL 16 + pgvector and Redis 7 services
├── package.json                          # Root workspace configuration
└── README.md                             # Complete architectural & operational guide
```

---

## 🚦 How Rate Limiting Works in Detail

The system uses a multi-tier rate limiting architecture designed to protect both compute infrastructure and upstream LLM API limits.

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor / Client
    participant FE as Frontend Client (api.ts)
    participant GW as Express Gateway
    participant RL as Redis Rate Limiter
    participant Lock as Redis Mutex Lock

    User->>FE: Click "Ask AI"
    FE->>FE: Check client throttle (1200ms cooldown)
    FE->>GW: POST /api/ask (X-Session-Id, IP)
    GW->>RL: INCR rate_limit:ip:<client_ip>
    alt Request Count > 5 within 60s
        RL-->>GW: Count = 6 (Exceeded)
        GW-->>FE: HTTP 429 Too Many Requests (Retry-After: 60)
        FE->>User: Display Cooldown Timer (60s countdown)
    else Count <= 5
        RL-->>GW: Count OK
        GW->>Lock: SET session:<id>:lock NX EX 30
        alt Session Already Processing Request
            Lock-->>GW: Lock Failed (Conflict)
            GW-->>FE: HTTP 409 Concurrent Request in Progress
        else Lock Acquired
            Lock-->>GW: OK
            GW->>GW: Execute AI Generation...
            GW->>Lock: DEL session:<id>:lock
            GW-->>FE: HTTP 200 Success + Token Telemetry
        end
    end
```

### 1. Backend Sliding Window IP Limiter (`rate-limiter.ts`)

- **Key Format**: `rate_limit:ip:<normalized_ip>`
- **Window Duration**: `60,000ms` (1 minute).
- **Threshold**: Maximum **5 requests / minute per IP**.
- **Atomic Redis Pipeline**:
  ```ts
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.pexpire(key, env.RATE_LIMIT_WINDOW_MS);
  }
  ```
- **Headers Injected**:
  - `X-RateLimit-Limit`: `5`
  - `X-RateLimit-Remaining`: Math.max(0, `5 - current`)
  - `X-RateLimit-Reset`: Milliseconds remaining until key TTL expiry.
- **Violation Response**: Returns `HTTP 429` with JSON error payload `{ code: 'RATE_LIMIT_EXCEEDED', retryAfterSeconds: 60 }`.

### 2. Distributed Session Concurrency Lock

- To prevent duplicate concurrent requests (e.g. rapid double-clicking or scripted bursts from the same session), the gateway creates an atomic distributed lock:
  ```ts
  const acquired = await redis.set(
    `session:${sessionId}:lock`,
    "1",
    "EX",
    30,
    "NX",
  );
  ```
- If a lock exists, the gateway rejects the second request immediately with `HTTP 409 Concurrent Request`.
- The lock is released in a `finally` block once generation and token reconciliation finish.

### 3. Client-Side Throttle Protection (`api.ts` & `AILab.tsx`)

- **Debounce Guard**: Enforces a minimum interval of **1,200ms** between user queries directly in the frontend browser client.
- **Auto-Cooldown Countdown**: When an HTTP 429 is received, the frontend automatically starts a synchronized ticking countdown timer, disables input fields, and displays the remaining cooldown duration.

---

## ⚡ How Redis Works in Detail

Redis 7 serves as the high-throughput, low-latency control plane for caching, concurrency locking, and token budget management.

```mermaid
graph TD
    subgraph Redis Memory Store
        R1[("cache:ask:<sha256>")]
        R2[("cache:embed:<sha256>")]
        R3[("rate_limit:ip:<ip>")]
        R4[("session:<id>:lock")]
        R5[("budget:global:YYYY-MM-DD:reserved")]
        R6[("budget:global:YYYY-MM-DD:used")]
    end

    subgraph Operations
        OP1[Exact Response Cache Hit] --> R1
        OP2[Pre-Computed Embedding Hit] --> R2
        OP3[IP Request Throttling] --> R3
        OP4[Mutual Exclusion Lock] --> R4
        OP5[Atomic Pre-Allocation] --> R5
        OP6[Daily Burn Ledger] --> R6
    end
```

### 1. High-Performance Response & Embedding Caching

- **Ask Query Cache**: Keys are structured as `cache:ask:<sha256(normalized_question)>`.
  - Normalization trims whitespace, strips punctuation, and converts queries to lowercase.
  - Identical queries are returned instantly in **$<5\text{ms}$** with `cacheHit: true` and `usage: { totalTokens: 0 }`, saving 100% of LLM cost.
  - Configured with a default TTL of **3,600 seconds (1 hour)**.
- **Vector Embedding Cache**: Keys are structured as `cache:embed:<sha256(text)>`.
  - Avoids re-requesting OpenAI `text-embedding-3-small` for repeated queries.
  - Configured with a default TTL of **86,400 seconds (24 hours)**.

### 2. Two-Phase Token Reservation & Reconciliation Algorithm

The gateway implements an atomic token accounting mechanism to guarantee that daily API spend never exceeds budget:

$$\text{Estimated Tokens } (E) = \text{tokens}(Q) + \text{tokens}(C) + \text{Max Output Tokens}$$

1. **Phase 1: Pre-Call Reservation**:
   - Computes the pessimistic token requirement $E$.
   - Atomically queries Redis for the sum of `used + reserved` tokens for the current UTC day.
   - If $(\text{used} + \text{reserved} + E) > \text{GLOBAL\_DAILY\_TOKEN\_LIMIT} \ (30,000)$, the call is rejected before hitting Gemini or OpenAI:
     ```ts
     await redis.incrby(`budget:global:${today}:reserved`, estimatedTokens);
     ```
2. **Phase 2: Post-Call Reconciliation**:
   - The AI provider responds with actual tokens consumed $A$ (e.g. $A = \text{inputTokens} + \text{outputTokens}$).
   - In a single atomic operation:
     - Deducts $E$ from `budget:global:${today}:reserved`.
     - Adds $A$ to `budget:global:${today}:used`.
     - Records $A$ in PostgreSQL `sessions` and `usage_logs`.
   - If the API call fails or times out, $E$ is returned to the reservation pool without penalizing daily usage.

---

## 🤖 Dual AI Services Deep Dive

### Service 1: Ask Yash (Google Gemini 3.6 Flash)

- **Purpose**: Conversational AI assistant grounded in Yash’s resume, technical skills, projects, and career history.
- **Model**: `gemini-3.6-flash` via the official `@ai-sdk/google` provider.
- **Reasoning Headroom & Output Guarantee**:
  - `gemini-3.6-flash` uses internal thinking/reasoning before emitting text.
  - The service guarantees a generous `maxOutputTokens >= 1200`, ensuring the model never exhausts its budget during reasoning and finishes all sentences completely.
- **Prompt Structure (`ask-yash.prompt.ts`)**:
  - Grounded in canonical portfolio facts with strict instructions to answer in **1–2 concise, structured paragraphs + bullet points**.
  - Strict injection and persona boundaries to prevent jailbreaks or prompt leakage.

### Service 2: RAG Knowledge Engine (pgvector + gpt-4o-mini)

- **Purpose**: Deep-dive technical question answering with source citations directly retrieved from documentation.
- **Vector Store**: PostgreSQL 16 with `pgvector` (`vector(1536)`).
- **Embedding Model**: OpenAI `text-embedding-3-small`.
- **Cosine Retrieval Logic**:
  $$\text{Similarity Score} = 1 - (\mathbf{chunk\_embedding} \Leftrightarrow \mathbf{query\_embedding})$$
  - Filtered by `similarity_score >= 0.30` and ordered by cosine proximity `LIMIT 4`.
- **Synthesis Engine**: OpenAI `gpt-4o-mini` reads the retrieved context chunks and synthesizes a grounded answer with bold highlights and architecture breakdowns.
- **Source Transparency**: The API returns both the synthesized response and the matching document chunks (title, category, similarity score, content snippet).

---

## 🛡️ Security & Prompt Injection Defenses

The gateway implements a defense-in-depth security pipeline before any prompt is processed:

1. **Deterministic Injection Classifier (`injection-guard.ts`)**:
   - Scans queries against heuristic regex patterns:
     - System prompt extraction (`ignore previous instructions`, `show system prompt`, `reveal instructions`).
     - Roleplay hijacking (`you are now in developer mode`, `DAN mode`, `unrestricted AI`).
     - Delimiter tampering (` ```system `, `[INST]`, `<|im_start|>`).
   - If detected, throws `PromptInjectionError (HTTP 400)` and prevents LLM invocation.
2. **Topic Boundary Guard (`topic-guard.ts`)**:
   - Evaluates whether the question falls within software engineering, AI architecture, or portfolio background.
   - Refuses malicious, offensive, or arbitrary third-party requests.
3. **Strict Zod Contract Validation**:
   - Every inbound query is validated for string length, non-empty whitespace, and character constraints.

---

## 🖥️ Frontend Telemetry HUD & Markdown Rendering

### 1. Live Session Telemetry HUD (`AILab.tsx`)

The frontend displays real-time telemetry connected to backend session state:

- **Ask Yash Meter**: Displays remaining questions (e.g. `8 / 8 Req Left`) and remaining token capacity (`10,000 / 10,000 Tokens`) with animated progress bars.
- **RAG Engine Meter**: Displays remaining RAG questions (`3 / 3 Req Left`) and token quotas.
- **Rate Guard Indicator**: Displays active status for the 5 req/min window limiter and single-request concurrency lock.

### 2. Semantic Markdown Display (`MarkdownRenderer.tsx`)

LLM responses are formatted using `react-markdown` with customized aesthetic treatments:

- **Headers (`#`, `##`, `###`)**: Styled with Space Grotesk typography and glowing theme accents.
- **Lists (`<ul>`, `<ol>`)**: Indented bullet points and numbered sequences with custom spacing.
- **Code Elements (`<code>`)**: Styled inline monospace chips with glowing border highlights.
- **Citations Accordion**: Collapsible drawer that lets visitors inspect raw vector chunks and similarity percentages.

---

## 🗄️ Database Schema & Migrations

### Tables Defined (`001_initial_schema.sql` & `002_vector_index.sql`):

```sql
-- 1. Anonymous Sessions Table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash VARCHAR(64) NOT NULL,
    ask_questions INT NOT NULL DEFAULT 0,
    rag_questions INT NOT NULL DEFAULT 0,
    ask_tokens INT NOT NULL DEFAULT 0,
    rag_tokens INT NOT NULL DEFAULT 0,
    active_requests INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 2. Knowledge Documents Table
CREATE TABLE documents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    source_path VARCHAR(255) NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Vector Document Chunks (pgvector)
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    token_count INT NOT NULL,
    embedding vector(1536) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. HNSW Vector Index for Sub-Millisecond Cosine Search
CREATE INDEX document_chunks_embedding_hnsw_idx
ON document_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 5. Telemetry Usage Logs
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    service VARCHAR(16) NOT NULL,
    model VARCHAR(64) NOT NULL,
    input_tokens INT NOT NULL,
    output_tokens INT NOT NULL,
    total_tokens INT NOT NULL,
    latency_ms INT NOT NULL,
    cache_hit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🚀 Local Development & Quickstart

### Prerequisites

- **Node.js**: v20.x or v22.x
- **Docker & Docker Compose**: For PostgreSQL (pgvector) & Redis
- **API Keys**:
  - `GEMINI_API_KEY`: [Google AI Studio](https://aistudio.google.com/)
  - `OPENAI_API_KEY`: [OpenAI Platform](https://platform.openai.com/)

---

### Step 1: Clone and Start Infrastructure

```bash
# 1. Start PostgreSQL (Port 5433) and Redis (Port 6379)
docker compose up -d
```

### Step 2: Configure Backend Environment

Create `backend/.env`:

```ini
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

DATABASE_URL=postgresql://yash:password@localhost:5433/yash_ai
REDIS_URL=redis://localhost:6379

GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

ASK_MODEL=gemini-3.6-flash
ASK_MAX_OUTPUT_TOKENS=1000
ASK_SESSION_TOKEN_BUDGET=10000

RAG_CHAT_MODEL=gpt-4o-mini
RAG_EMBEDDING_MODEL=text-embedding-3-small
RAG_MAX_OUTPUT_TOKENS=1000
RAG_SESSION_LIMIT=3
RAG_SESSION_TOKEN_BUDGET=10000
RAG_SIMILARITY_THRESHOLD=0.30

GLOBAL_DAILY_TOKEN_LIMIT=30000
RATE_LIMIT_MAX_REQUESTS=5
```

### Step 3: Run Database Migrations & Ingest Knowledge Base

```bash
cd backend
npm install

# Run database schema migrations
npm run migrate

# Ingest knowledge documents into PostgreSQL pgvector
npm run ingest

# Start backend in development mode
npm run dev
```

_Backend will start on `http://localhost:4000`._

### Step 4: Configure & Start Frontend

Create `frontend/.env` (or configure in deployment dashboard):

```ini
# Development: Leave empty to use Vite proxy (/api -> http://localhost:4000)
VITE_API_BASE_URL=

# Production (e.g., Vercel / Netlify / Custom Domain):
# Set to your deployed backend URL:
# VITE_API_BASE_URL=https://api.yourdomain.com
```

Start the frontend:

```bash
cd ../frontend
npm install
npm run dev
```

_Frontend will start on `http://localhost:3000`._

---

## 🧪 Testing & Verification

The repository contains an automated test suite powered by **Vitest** covering all critical security and gateway subsystems:

```bash
cd backend
npm test
```

### Test Suite Summary:

```
 ✓ tests/unit/normalize.test.ts        (1 test)
 ✓ tests/unit/errors.test.ts           (7 tests)
 ✓ tests/unit/topic-guard.test.ts      (2 tests)
 ✓ tests/unit/token-estimator.test.ts  (3 tests)
 ✓ tests/unit/injection-guard.test.ts  (2 tests)
 ✓ tests/unit/health.test.ts           (2 tests)
 ✓ tests/unit/api.test.ts              (6 tests)

 Test Files  7 passed (7)
      Tests  23 passed (23)
```

---

## 👤 Author

**Yash**  
_Generative AI & Full-Stack Software Engineer_

- **Email**: anantyash.2710@gmail.com
- **LinkedIn**: [linkedin.com/in/anantyash](https://linkedin.com/in/anantyash)
- **GitHub**: [github.com/anantyash](https://github.com/anantyash)
