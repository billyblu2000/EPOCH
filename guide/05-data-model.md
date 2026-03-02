# 数据模型设计（Supabase PostgreSQL）

## 一、ER 关系总览

```
User (Supabase Auth)
 └── 1:N ── Project
               ├── 1:1 ── Genesis (创世书)
               ├── 1:1 ── Theogony (神世法)
               │            └── 1:N ── TheogonyField (动态字段)
               ├── 1:1 ── Chronos (时空律)
               │            └── 1:N ── TimelineNode (时间节点)
               ├── 1:1 ── Anthropocene (众生相)
               │            └── 1:N ── Character (人物卡)
               ├── 1:N ── Chapter (章节，含因果一纪大纲 + 因果二纪分镜状态 + 正文)
               │            └── 1:N ── Storyboard (分镜)
               └── project_stage (当前所处纪元)
```

## 二、表结构详细设计

### 2.1 projects（项目表）

```sql
CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,                          -- 项目名称
  description   TEXT,                                   -- 项目简介
  stage         TEXT NOT NULL DEFAULT 'genesis',        -- 当前阶段: genesis | theogony | chronos | anthropocene | causality_1 | causality_2 | writing
  -- 注：完成因果一纪（causality_1）定稿后，stage 可直接推进到 writing。
  -- 因果二纪（causality_2）为可选阶段，用户可跳过。
  -- 每章是否可开始写作由 chapters.storyboard_status 控制（必须为 finalized）。
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

### 2.2 genesis（创世纪）

```sql
CREATE TABLE genesis (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  
  -- 结构化输入字段
  genre         TEXT,           -- 题材
  target_reader TEXT,           -- 目标读者
  perspective   TEXT,           -- 视角
  protagonist   JSONB,         -- 主人公基础特质 { gender, age_range, traits[] }
  chapter_word_target  INT,    -- 单章目标字数
  total_chapters       INT,    -- 总目标章节数
  total_word_target    INT,    -- 总目标字数
  pacing_model  TEXT,           -- 内容分配计划/节奏模型
  novel_function TEXT,          -- 小说功能
  core_synopsis TEXT,           -- 核心大纲
  basic_worldview TEXT,         -- 基础世界观
  
  -- AI 生成的产出物
  artifact_text TEXT,           -- 《创世书》正文（非结构化文本）
  
  -- 状态
  status        TEXT DEFAULT 'draft',  -- draft | finalized
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

### 2.3 theogony + theogony_fields（神世纪）

```sql
CREATE TABLE theogony (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  
  notes         TEXT,           -- 备注字段
  artifact_text TEXT,           -- 《神世法》正文
  
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE theogony_fields (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theogony_id   UUID NOT NULL REFERENCES theogony(id) ON DELETE CASCADE,
  
  field_name    TEXT NOT NULL,  -- 字段名（AI 生成或用户添加）
  field_value   TEXT,           -- 字段值
  sort_order    INT DEFAULT 0,  -- 排序
  
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

### 2.4 chronos + timeline_nodes（时空纪）

```sql
CREATE TABLE chronos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  
  notes         TEXT,           -- 备注字段
  artifact_text TEXT,           -- 《时空律》正文（含剧情叙述 + 剪辑建议）
  
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE timeline_nodes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chronos_id    UUID NOT NULL REFERENCES chronos(id) ON DELETE CASCADE,
  
  event_time    TEXT,           -- 发生时间（可为空，文本格式灵活）
  description   TEXT NOT NULL,  -- 事件描述
  sort_order    INT DEFAULT 0,  -- 排序
  
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

### 2.5 anthropocene + characters（人世纪）

```sql
CREATE TABLE anthropocene (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  
  artifact_text TEXT,           -- 《众生相》正文
  
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE characters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anthropocene_id UUID NOT NULL REFERENCES anthropocene(id) ON DELETE CASCADE,
  
  name          TEXT NOT NULL,      -- 姓名
  faction       TEXT,               -- 归属势力
  motivation    TEXT,               -- 核心动机（欲望/恐惧）
  personality   TEXT,               -- 性格底色
  habits        TEXT,               -- 习惯
  quirks        TEXT,               -- 行为/语言癖好（口癖等）
  relationships JSONB,              -- 关系网 [{ target_character_id, relation_type, description }]
  -- 注：关系引用的 target_character_id 无法通过 JSONB 外键约束自动级联删除。
  -- 当删除某个 character 时，应用层负责遍历其余人物的 relationships，
  -- 移除所有引用了被删人物 ID 的条目，确保数据一致性。
  sort_order    INT DEFAULT 0,
  
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

### 2.6 chapters（章节 — 因果一纪 + 正文）

```sql
CREATE TABLE chapters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- 因果一纪字段
  chapter_number    INT NOT NULL,       -- 章节序号
  title             TEXT,               -- 章节名称
  brief_description TEXT,               -- 1-2 句话核心剧情描述
  detailed_description TEXT,            -- ~500 字详细剧情描述
  
  -- 因果二纪状态
  storyboard_status TEXT DEFAULT 'pending', -- pending | draft | finalized
  storyboard_text   TEXT,               -- 《命理镜》该章非结构化分镜描述
  
  -- 正文写作
  content           TEXT,               -- 正文内容
  word_count        INT DEFAULT 0,      -- 当前字数
  writing_status    TEXT DEFAULT 'not_started', -- not_started | in_progress | completed
  
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(project_id, chapter_number)
);
```

### 2.7 storyboards（分镜 — 因果二纪结构化数据）

```sql
CREATE TABLE storyboards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id    UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  
  shot_number       INT NOT NULL,       -- 镜头序号
  characters        TEXT[],             -- 登场人物名称列表
  location          TEXT,               -- 场景/地点
  event             TEXT,               -- 事件描述
  action_detail     TEXT,               -- 动作细节
  emotion_state     TEXT,               -- 心理/情绪状态
  sort_order        INT DEFAULT 0,
  
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
```

## 三、Row Level Security (RLS) 策略

所有表启用 RLS，核心规则：**用户只能访问自己的数据**。

```sql
-- 示例：projects 表的 RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 其他表通过 project_id 关联到 user_id 进行权限控制
-- 使用 JOIN 或 subquery 检查 ownership
```

## 四、索引建议

```sql
-- 常用查询优化
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_genesis_project_id ON genesis(project_id);
CREATE INDEX idx_chapters_project_id ON chapters(project_id);
CREATE INDEX idx_chapters_sort ON chapters(project_id, sort_order);
CREATE INDEX idx_storyboards_chapter_id ON storyboards(chapter_id);
CREATE INDEX idx_timeline_nodes_chronos_id ON timeline_nodes(chronos_id);
CREATE INDEX idx_characters_anthropocene_id ON characters(anthropocene_id);
CREATE INDEX idx_theogony_fields_theogony_id ON theogony_fields(theogony_id);
```
