CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id VARCHAR(64) NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  service VARCHAR(20) NOT NULL, -- 'ask' | 'rag'
  provider VARCHAR(20) NOT NULL, -- 'gemini' | 'openai'
  model VARCHAR(50) NOT NULL,
  input_tokens INT NOT NULL DEFAULT 0,
  output_tokens INT NOT NULL DEFAULT 0,
  total_tokens INT NOT NULL DEFAULT 0,
  cache_hit BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL, -- 'success' | 'rate_limited' | 'budget_exceeded' | 'error'
  latency_ms INT NOT NULL DEFAULT 0,
  error_code VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_session_id ON usage_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
