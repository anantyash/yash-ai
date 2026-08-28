# Architecture: RAG Engine

## Purpose & Boundaries

The "RAG Engine" is a Retrieval-Augmented Generation system powered by OpenAI embeddings (`text-embedding-3-small`), PostgreSQL with `pgvector` (HNSW cosine similarity indexing), and OpenAI generation (`gpt-4o-mini`).

## End-to-End Execution Pipeline

1. **Query Normalization & Validation**: Validates user query via Zod schemas and executes local prompt injection guards.
2. **Embedding Generation**: Generates 1536-dimensional vector embedding for the input query via OpenAI, with Redis caching for repeat queries.
3. **pgvector Similarity Retrieval**: Executes top-K cosine similarity search (`<=>` operator) against document chunks stored in PostgreSQL with HNSW index.
4. **Context Construction & Grounding**: Assembles retrieved high-similarity chunks into an untrusted data block, strictly instructing the model to synthesize answers using only the provided facts.
5. **Grounded Generation with OpenAI**: Invokes `gpt-4o-mini` with low temperature ($0.1$) to produce factual answers accompanied by source citations and similarity scores.
