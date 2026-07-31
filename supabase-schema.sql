-- 1. 会话表
CREATE TABLE IF NOT EXISTS sessions (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT '新对话',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 消息表
CREATE TABLE IF NOT EXISTS messages (
  id          BIGSERIAL PRIMARY KEY,
  session_id  BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visible     BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at);

-- 3. 记忆表
CREATE TABLE IF NOT EXISTS memories (
  id          BIGSERIAL PRIMARY KEY,
  content     TEXT NOT NULL,
  source_ids  BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 设置表
CREATE TABLE IF NOT EXISTS settings (
  id                    INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  system_prompt         TEXT NOT NULL DEFAULT '',
  temperature           REAL NOT NULL DEFAULT 0.7,
  max_tokens            INTEGER NOT NULL DEFAULT 1024,
  context_rounds        INTEGER NOT NULL DEFAULT 10,
  summary_threshold     INTEGER NOT NULL DEFAULT 4000,
  summary_keep_rounds   INTEGER NOT NULL DEFAULT 3,
  model_name            TEXT NOT NULL DEFAULT 'deepseek-v4-pro',
  summary_model         TEXT NOT NULL DEFAULT 'deepseek-v4-pro',
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 插入默认设置
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
