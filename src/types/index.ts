// ============================================================
// EPOCH — 全局 TypeScript 类型定义
// ============================================================

// --- 纪元阶段 ---
export type ProjectStage =
  | "genesis"
  | "theogony"
  | "chronos"
  | "anthropocene"
  | "causality_1"
  | "causality_2"
  | "writing";

export type EpochStatus = "draft" | "finalized";

export type StoryboardStatus = "pending" | "draft" | "finalized";

export type WritingStatus = "not_started" | "in_progress" | "completed";

// --- 纪元信息常量类型 ---
export interface EpochInfo {
  key: ProjectStage;
  name: string;
  nameEn: string;
  icon: string;
  artifact: string;
  completionText: string;
  route: string;
}

// --- Project ---
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  stage: ProjectStage;
  created_at: string;
  updated_at: string;
}

// --- Genesis (创世纪) ---
export interface Protagonist {
  gender: string;
  age_range: string;
  traits: string[];
}

export interface GenesisForm {
  genre: string;
  target_reader: string;
  perspective: string;
  protagonist: Protagonist;
  chapter_word_target: number | null;
  total_chapters: number | null;
  total_word_target: number | null;
  pacing_model: string;
  novel_function: string;
  core_synopsis: string;
  basic_worldview: string;
}

export interface Genesis {
  id: string;
  project_id: string;
  genre: string | null;
  target_reader: string | null;
  perspective: string | null;
  protagonist: Protagonist | null;
  chapter_word_target: number | null;
  total_chapters: number | null;
  total_word_target: number | null;
  pacing_model: string | null;
  novel_function: string | null;
  core_synopsis: string | null;
  basic_worldview: string | null;
  artifact_text: string | null;
  status: EpochStatus;
  created_at: string;
  updated_at: string;
}

// --- Theogony (神世纪) ---
export interface DynamicField {
  id: string;
  theogony_id: string;
  field_name: string;
  field_value: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Theogony {
  id: string;
  project_id: string;
  notes: string | null;
  artifact_text: string | null;
  status: EpochStatus;
  created_at: string;
  updated_at: string;
}

// --- Chronos (时空纪) ---
export interface TimelineNode {
  id: string;
  chronos_id: string;
  event_time: string | null;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Chronos {
  id: string;
  project_id: string;
  notes: string | null;
  artifact_text: string | null;
  status: EpochStatus;
  created_at: string;
  updated_at: string;
}

// --- Anthropocene (人世纪) ---
export interface CharacterRelation {
  target_character_id: string;
  relation_type: string;
  description: string;
}

export interface CharacterCard {
  id: string;
  anthropocene_id: string;
  name: string;
  faction: string | null;
  motivation: string | null;
  personality: string | null;
  habits: string | null;
  quirks: string | null;
  relationships: CharacterRelation[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Anthropocene {
  id: string;
  project_id: string;
  artifact_text: string | null;
  status: EpochStatus;
  created_at: string;
  updated_at: string;
}

// --- Chapter (因果一纪 + 正文) ---
export interface ChapterOutline {
  id: string;
  project_id: string;
  chapter_number: number;
  title: string | null;
  brief_description: string | null;
  detailed_description: string | null;
  storyboard_status: StoryboardStatus;
  storyboard_text: string | null;
  content: string | null;
  word_count: number;
  writing_status: WritingStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// --- Storyboard (因果二纪) ---
export interface StoryboardShot {
  id: string;
  chapter_id: string;
  shot_number: number;
  characters: string[];
  location: string | null;
  event: string | null;
  action_detail: string | null;
  emotion_state: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// --- Writing Workspace ---
export interface WritingContext {
  chapter_id: string;
  current_storyboard: StoryboardShot | null;
  characters: CharacterCard[];
  preceding_text: string;
  user_instruction: string;
  entity_tags: string[];
  dimension_tags: string[];
  target_length: number | null;
}

// --- AI Service ---
export interface AIService {
  generateGenesis(input: GenesisForm): AsyncIterable<string>;
  generateTheogonyFields(genesis: string): Promise<DynamicField[]>;
  generateTheogony(fields: DynamicField[], genesis: string): AsyncIterable<string>;
  generateTimeline(genesis: string, theogony: string): Promise<TimelineNode[]>;
  generateChronos(timeline: TimelineNode[], ...artifacts: string[]): AsyncIterable<string>;
  generateCharacters(...artifacts: string[]): Promise<CharacterCard[]>;
  generateAnthropocene(characters: CharacterCard[], ...artifacts: string[]): AsyncIterable<string>;
  generateChapterOutlines(...artifacts: string[]): Promise<ChapterOutline[]>;
  generateChapterDetail(chapter: ChapterOutline, ...artifacts: string[]): AsyncIterable<string>;
  generateStoryboard(chapterDetail: string, ...artifacts: string[]): Promise<StoryboardShot[]>;
  generateStoryboardNarrative(shots: StoryboardShot[], ...artifacts: string[]): AsyncIterable<string>;
  generateContinuation(context: WritingContext): AsyncIterable<string>;
}
