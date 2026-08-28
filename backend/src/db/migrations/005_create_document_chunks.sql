CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INT NOT NULL,
  embedding vector(1536) NOT NULL, -- text-embedding-3-small
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cosine distance indexing with HNSW for sub-millisecond retrieval
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks 
USING hnsw (embedding vector_cosine_ops);
