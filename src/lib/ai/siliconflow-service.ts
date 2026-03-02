import OpenAI from "openai";
import type {
  AIService,
  GenesisForm,
  DynamicField,
  TimelineNode,
  CharacterCard,
  ChapterOutline,
  StoryboardShot,
  WritingContext,
} from "@/types";

const client = new OpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: "https://api.siliconflow.cn/v1",
});

const MODEL = process.env.SILICONFLOW_MODEL || "Pro/MiniMaxAI/MiniMax-M2.5";

// ---- helpers ----

async function* streamChat(
  systemPrompt: string,
  userPrompt: string
): AsyncIterable<string> {
  const stream = await client.chat.completions.create({
    model: MODEL,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 4096,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) yield delta;
  }
}

async function chatJSON<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content || "{}";
  return JSON.parse(text) as T;
}

function uuid(): string {
  return crypto.randomUUID();
}

// ---- prompts ----

function genesisSystemPrompt(): string {
  return `你是一位世界级的小说策划大师。用户会给你小说的基础设定，请你据此生成一份"创世书"——这是整本小说的最高宪法。

创世书应包含以下章节：
# 创世书
## 一、作品基因（题材、读者、视角）
## 二、核心逻辑（主角、核心矛盾、核心悬念）
## 三、叙事工程（篇幅规划、节奏模型）
## 四、情感内核（小说功能、哲学命题、情感共鸣点）

用 Markdown 格式输出。内容要具体、有深度，不要泛泛而谈。每个章节至少200字。`;
}

function genesisUserPrompt(input: GenesisForm): string {
  return `小说基础设定如下：

**题材：** ${input.genre}
**目标读者：** ${input.target_reader}
**叙事视角：** ${input.perspective}
**主角：** 性别 ${input.protagonist.gender}，年龄段 ${input.protagonist.age_range}，特质：${input.protagonist.traits.join("、")}
**章均字数：** ${input.chapter_word_target ?? "未定"}
**总章数：** ${input.total_chapters ?? "未定"}
**总字数目标：** ${input.total_word_target ?? "未定"}
**节奏模型：** ${input.pacing_model}
**小说功能：** ${input.novel_function}
**核心梗概：** ${input.core_synopsis}
**基础世界观：** ${input.basic_worldview}

请生成创世书。`;
}

// ---- SiliconFlow AI Service ----

export class SiliconFlowAIService implements AIService {
  async *generateGenesis(input: GenesisForm): AsyncIterable<string> {
    yield* streamChat(genesisSystemPrompt(), genesisUserPrompt(input));
  }

  async generateTheogonyFields(genesis: string): Promise<DynamicField[]> {
    const systemPrompt = `你是小说世界观设计师。根据创世书内容，推荐4-6个需要用户填写的世界观字段。
返回 JSON 格式：{ "fields": [{ "field_name": "字段名", "field_value": "建议值/示例" }] }`;

    const result = await chatJSON<{
      fields: { field_name: string; field_value: string }[];
    }>(systemPrompt, `创世书内容：\n${genesis}`);

    const theogonyId = uuid();
    return (result.fields || []).map((f, i) => ({
      id: uuid(),
      theogony_id: theogonyId,
      field_name: f.field_name,
      field_value: f.field_value,
      sort_order: i,
      created_at: "",
      updated_at: "",
    }));
  }

  async *generateTheogony(
    fields: DynamicField[],
    genesis: string
  ): AsyncIterable<string> {
    const fieldsText = fields
      .map((f) => `- ${f.field_name}：${f.field_value}`)
      .join("\n");
    const systemPrompt = `你是小说世界观构建大师。根据创世书和世界观字段，生成一份详尽的"神世法"文档。用 Markdown 格式，内容具体深入。`;
    yield* streamChat(
      systemPrompt,
      `创世书：\n${genesis}\n\n世界观字段：\n${fieldsText}`
    );
  }

  async generateTimeline(
    genesis: string,
    theogony: string
  ): Promise<TimelineNode[]> {
    const systemPrompt = `你是小说时间线设计师。根据创世书和神世法，生成5-8个关键时间节点。
返回 JSON：{ "events": [{ "event_time": "时间", "description": "事件描述" }] }`;

    const result = await chatJSON<{
      events: { event_time: string; description: string }[];
    }>(systemPrompt, `创世书：\n${genesis}\n\n神世法：\n${theogony}`);

    const chronosId = uuid();
    return (result.events || []).map((e, i) => ({
      id: uuid(),
      chronos_id: chronosId,
      event_time: e.event_time,
      description: e.description,
      sort_order: i,
      created_at: "",
      updated_at: "",
    }));
  }

  async *generateChronos(
    timeline: TimelineNode[],
    ...artifacts: string[]
  ): AsyncIterable<string> {
    const timelineText = timeline
      .map((t) => `- ${t.event_time}：${t.description}`)
      .join("\n");
    const systemPrompt = `你是小说时空设计师。根据时间线和前序纪元文档，生成"时空律"。用 Markdown 格式。`;
    yield* streamChat(
      systemPrompt,
      `时间线：\n${timelineText}\n\n前序纪元：\n${artifacts.join("\n---\n")}`
    );
  }

  async generateCharacters(
    ...artifacts: string[]
  ): Promise<CharacterCard[]> {
    const systemPrompt = `你是小说角色设计师。根据已有纪元文档，生成3-5个核心角色卡。
返回 JSON：{ "characters": [{ "name": "名字", "faction": "阵营", "motivation": "动机", "personality": "性格", "habits": "习惯", "quirks": "怪癖" }] }`;

    const result = await chatJSON<{
      characters: {
        name: string;
        faction: string;
        motivation: string;
        personality: string;
        habits: string;
        quirks: string;
      }[];
    }>(systemPrompt, `纪元文档：\n${artifacts.join("\n---\n")}`);

    const anthropoceneId = uuid();
    return (result.characters || []).map((c, i) => ({
      id: uuid(),
      anthropocene_id: anthropoceneId,
      name: c.name,
      faction: c.faction,
      motivation: c.motivation,
      personality: c.personality,
      habits: c.habits,
      quirks: c.quirks,
      relationships: null,
      sort_order: i,
      created_at: "",
      updated_at: "",
    }));
  }

  async *generateAnthropocene(
    characters: CharacterCard[],
    ...artifacts: string[]
  ): AsyncIterable<string> {
    const charsText = characters
      .map((c) => `- ${c.name}（${c.faction}）：${c.personality}`)
      .join("\n");
    const systemPrompt = `你是小说角色群像设计师。根据角色卡和纪元文档，生成"众生相"文档。用 Markdown 格式。`;
    yield* streamChat(
      systemPrompt,
      `角色：\n${charsText}\n\n纪元文档：\n${artifacts.join("\n---\n")}`
    );
  }

  async generateChapterOutlines(
    ...artifacts: string[]
  ): Promise<ChapterOutline[]> {
    const systemPrompt = `你是小说大纲设计师。根据所有纪元文档，生成章节大纲列表。
返回 JSON：{ "chapters": [{ "chapter_number": 1, "title": "章节名", "brief_description": "一句话简介" }] }`;

    const result = await chatJSON<{
      chapters: {
        chapter_number: number;
        title: string;
        brief_description: string;
      }[];
    }>(systemPrompt, `纪元文档：\n${artifacts.join("\n---\n")}`);

    const projectId = uuid();
    return (result.chapters || []).map((c, i) => ({
      id: uuid(),
      project_id: projectId,
      chapter_number: c.chapter_number,
      title: c.title,
      brief_description: c.brief_description,
      detailed_description: null,
      storyboard_status: "pending" as const,
      storyboard_text: null,
      content: null,
      word_count: 0,
      writing_status: "not_started" as const,
      sort_order: i,
      created_at: "",
      updated_at: "",
    }));
  }

  async *generateChapterDetail(
    chapter: ChapterOutline,
    ...artifacts: string[]
  ): AsyncIterable<string> {
    const systemPrompt = `你是小说章节细化专家。根据章节大纲和纪元文档，为该章节写出500-800字的详细描述，包含场景、角色行为、情绪转折。`;
    yield* streamChat(
      systemPrompt,
      `章节：第${chapter.chapter_number}章「${chapter.title}」- ${chapter.brief_description}\n\n纪元文档：\n${artifacts.join("\n---\n")}`
    );
  }

  async generateStoryboard(
    chapterDetail: string,
    ...artifacts: string[]
  ): Promise<StoryboardShot[]> {
    const systemPrompt = `你是小说分镜设计师。根据章节详情，拆分为3-6个分镜镜头。
返回 JSON：{ "shots": [{ "shot_number": 1, "characters": ["角色名"], "location": "地点", "event": "事件", "action_detail": "动作细节", "emotion_state": "情绪状态" }] }`;

    const result = await chatJSON<{
      shots: {
        shot_number: number;
        characters: string[];
        location: string;
        event: string;
        action_detail: string;
        emotion_state: string;
      }[];
    }>(
      systemPrompt,
      `章节详情：\n${chapterDetail}\n\n纪元文档：\n${artifacts.join("\n---\n")}`
    );

    const chapterId = uuid();
    return (result.shots || []).map((s, i) => ({
      id: uuid(),
      chapter_id: chapterId,
      shot_number: s.shot_number,
      characters: s.characters,
      location: s.location,
      event: s.event,
      action_detail: s.action_detail,
      emotion_state: s.emotion_state,
      sort_order: i,
      created_at: "",
      updated_at: "",
    }));
  }

  async *generateStoryboardNarrative(
    shots: StoryboardShot[],
    ...artifacts: string[]
  ): AsyncIterable<string> {
    const shotsText = shots
      .map(
        (s) =>
          `镜头${s.shot_number}：${s.location} | ${s.characters.join("、")} | ${s.event} | ${s.emotion_state}`
      )
      .join("\n");
    const systemPrompt = `你是小说分镜叙事专家。根据分镜列表写出流畅的分镜描述文本。用小说笔法。`;
    yield* streamChat(
      systemPrompt,
      `分镜：\n${shotsText}\n\n纪元文档：\n${artifacts.join("\n---\n")}`
    );
  }

  async *generateContinuation(context: WritingContext): AsyncIterable<string> {
    const systemPrompt = `你是一位顶尖网文写手。根据上下文续写小说正文。要求：
- 文笔流畅，有画面感
- 保持人物性格一致性
- 遵循用户的写作指令
- 目标字数：${context.target_length ?? 500}字左右`;

    const userPrompt = `前文：\n${context.preceding_text.slice(-2000)}\n\n当前分镜：${context.current_storyboard ? `${context.current_storyboard.location} | ${context.current_storyboard.event}` : "无"}\n\n涉及角色：${context.characters.map((c) => c.name).join("、") || "无"}\n\n写作指令：${context.user_instruction}`;

    yield* streamChat(systemPrompt, userPrompt);
  }
}
