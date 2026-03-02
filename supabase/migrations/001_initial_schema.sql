-- ============================================================
-- EPOCH 完整数据库 Schema
-- ============================================================

-- 项目表
CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  stage         TEXT NOT NULL DEFAULT 'genesis',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 创世纪
CREATE TABLE genesis (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  genre         TEXT,
  target_reader TEXT,
  perspective   TEXT,
  protagonist   JSONB,
  chapter_word_target  INT,
  total_chapters       INT,
  total_word_target    INT,
  pacing_model  TEXT,
  novel_function TEXT,
  core_synopsis TEXT,
  basic_worldview TEXT,
  artifact_text TEXT,
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 神世纪
CREATE TABLE theogony (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  notes         TEXT,
  artifact_text TEXT,
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE theogony_fields (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theogony_id   UUID NOT NULL REFERENCES theogony(id) ON DELETE CASCADE,
  field_name    TEXT NOT NULL,
  field_value   TEXT,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 时空纪
CREATE TABLE chronos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  notes         TEXT,
  artifact_text TEXT,
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE timeline_nodes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chronos_id    UUID NOT NULL REFERENCES chronos(id) ON DELETE CASCADE,
  event_time    TEXT,
  description   TEXT NOT NULL,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 人世纪
CREATE TABLE anthropocene (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  artifact_text TEXT,
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE characters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anthropocene_id UUID NOT NULL REFERENCES anthropocene(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  faction       TEXT,
  motivation    TEXT,
  personality   TEXT,
  habits        TEXT,
  quirks        TEXT,
  relationships JSONB,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 章节（因果一纪 + 正文）
CREATE TABLE chapters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  chapter_number    INT NOT NULL,
  title             TEXT,
  brief_description TEXT,
  detailed_description TEXT,
  storyboard_status TEXT DEFAULT 'pending',
  storyboard_text   TEXT,
  content           TEXT,
  word_count        INT DEFAULT 0,
  writing_status    TEXT DEFAULT 'not_started',
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, chapter_number)
);

-- 分镜（因果二纪）
CREATE TABLE storyboards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id    UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  shot_number       INT NOT NULL,
  characters        TEXT[],
  location          TEXT,
  event             TEXT,
  action_detail     TEXT,
  emotion_state     TEXT,
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE genesis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own genesis"
  ON genesis FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

ALTER TABLE theogony ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own theogony"
  ON theogony FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

ALTER TABLE theogony_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own theogony_fields"
  ON theogony_fields FOR ALL
  USING (theogony_id IN (SELECT t.id FROM theogony t JOIN projects p ON t.project_id = p.id WHERE p.user_id = auth.uid()))
  WITH CHECK (theogony_id IN (SELECT t.id FROM theogony t JOIN projects p ON t.project_id = p.id WHERE p.user_id = auth.uid()));

ALTER TABLE chronos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own chronos"
  ON chronos FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

ALTER TABLE timeline_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own timeline_nodes"
  ON timeline_nodes FOR ALL
  USING (chronos_id IN (SELECT c.id FROM chronos c JOIN projects p ON c.project_id = p.id WHERE p.user_id = auth.uid()))
  WITH CHECK (chronos_id IN (SELECT c.id FROM chronos c JOIN projects p ON c.project_id = p.id WHERE p.user_id = auth.uid()));

ALTER TABLE anthropocene ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own anthropocene"
  ON anthropocene FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own characters"
  ON characters FOR ALL
  USING (anthropocene_id IN (SELECT a.id FROM anthropocene a JOIN projects p ON a.project_id = p.id WHERE p.user_id = auth.uid()))
  WITH CHECK (anthropocene_id IN (SELECT a.id FROM anthropocene a JOIN projects p ON a.project_id = p.id WHERE p.user_id = auth.uid()));

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own chapters"
  ON chapters FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own storyboards"
  ON storyboards FOR ALL
  USING (chapter_id IN (SELECT ch.id FROM chapters ch JOIN projects p ON ch.project_id = p.id WHERE p.user_id = auth.uid()))
  WITH CHECK (chapter_id IN (SELECT ch.id FROM chapters ch JOIN projects p ON ch.project_id = p.id WHERE p.user_id = auth.uid()));

-- ============================================================
-- 索引
-- ============================================================

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_genesis_project_id ON genesis(project_id);
CREATE INDEX idx_chapters_project_id ON chapters(project_id);
CREATE INDEX idx_chapters_sort ON chapters(project_id, sort_order);
CREATE INDEX idx_storyboards_chapter_id ON storyboards(chapter_id);
CREATE INDEX idx_timeline_nodes_chronos_id ON timeline_nodes(chronos_id);
CREATE INDEX idx_characters_anthropocene_id ON characters(anthropocene_id);
CREATE INDEX idx_theogony_fields_theogony_id ON theogony_fields(theogony_id);
