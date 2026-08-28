CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'project' | 'experience' | 'education' | 'architecture'
  source VARCHAR(255) NOT NULL,
  version INT DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
