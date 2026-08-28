CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_hash VARCHAR(64) NOT NULL,
  user_agent VARCHAR(255),
  ask_questions INT DEFAULT 0,
  rag_questions INT DEFAULT 0,
  ask_tokens INT DEFAULT 0,
  rag_tokens INT DEFAULT 0,
  active_requests INT DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_ip_hash ON sessions(ip_hash);
