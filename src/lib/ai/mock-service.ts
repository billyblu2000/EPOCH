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

const TYPING_DELAY = 20; // ms per character for streaming effect

async function* streamText(text: string): AsyncIterable<string> {
  const chars = text.split("");
  for (const char of chars) {
    await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY));
    yield char;
  }
}

function uuid(): string {
  return crypto.randomUUID();
}

const MOCK_GENESIS_TEXT = `# 创世书

## 一、作品基因

本书为一部仙侠题材的长篇小说，目标读者为男频修仙爱好者。故事以第三人称有限视角展开，主要跟随主角的感知与判断推进叙事。

## 二、核心逻辑

主人公为一名少年，天资平平却意志坚韧。在一次偶然的机遇中，获得了一枚远古残玉，自此踏上修行之路。故事的核心矛盾在于"资质"与"意志"的对抗——在一个以天赋定阶级的世界中，一个没有天赋的人能走多远？

## 三、叙事工程

全书预计200章，约60万字。节奏规划为：开篇20%铺垫主角身世与世界规则，30%展开修行与势力冲突，30%推向核心对抗与高潮，最后20%收束因果、揭示命运真相。

## 四、情感内核

本书兼具解压与深度思考属性。表层是爽快的修仙升级，底层探讨的是"命运是否可以被改写"这一哲学命题。主角的每一次突破都不是天降奇遇，而是在绝境中以意志力撕裂天赋的壁垒。`;

const MOCK_THEOGONY_TEXT = `# 神世法

## 一、天地法则

此世名为「玄霄界」，天地间弥漫着一种名为「元气」的基础能量。万物生长、修行突破、法术施展皆依赖元气。

## 二、境界体系

修行共分九境：聚气、筑基、金丹、元婴、化神、合体、渡劫、大乘、飞升。每一境界分初期、中期、后期、大圆满四个小阶段。`;

export class MockAIService implements AIService {
  async *generateGenesis(_input: GenesisForm): AsyncIterable<string> {
    yield* streamText(MOCK_GENESIS_TEXT);
  }

  async generateTheogonyFields(_genesis: string): Promise<DynamicField[]> {
    await new Promise((r) => setTimeout(r, 800));
    const theogonyId = uuid();
    return [
      { id: uuid(), theogony_id: theogonyId, field_name: "境界体系", field_value: "聚气 → 筑基 → 金丹 → 元婴 → 化神 → 合体 → 渡劫 → 大乘 → 飞升", sort_order: 0, created_at: "", updated_at: "" },
      { id: uuid(), theogony_id: theogonyId, field_name: "宗门/流派", field_value: "天剑宗、万法阁、幽冥教、散修联盟", sort_order: 1, created_at: "", updated_at: "" },
      { id: uuid(), theogony_id: theogonyId, field_name: "地理版图", field_value: "东域五国、南荒蛮地、西漠死域、北冥极渊、中州圣地", sort_order: 2, created_at: "", updated_at: "" },
      { id: uuid(), theogony_id: theogonyId, field_name: "命名风格", field_value: "古典雅致，多用双字名，宗门以自然意象命名", sort_order: 3, created_at: "", updated_at: "" },
    ];
  }

  async *generateTheogony(_fields: DynamicField[], _genesis: string): AsyncIterable<string> {
    yield* streamText(MOCK_THEOGONY_TEXT);
  }

  async generateTimeline(_genesis: string, _theogony: string): Promise<TimelineNode[]> {
    await new Promise((r) => setTimeout(r, 800));
    const chronosId = uuid();
    return [
      { id: uuid(), chronos_id: chronosId, event_time: "太初历3012年", description: "主角出生于东域边陲小镇", sort_order: 0, created_at: "", updated_at: "" },
      { id: uuid(), chronos_id: chronosId, event_time: "太初历3028年", description: "主角偶得远古残玉，踏上修行之路", sort_order: 1, created_at: "", updated_at: "" },
      { id: uuid(), chronos_id: chronosId, event_time: "太初历3032年", description: "天剑宗大比，主角崭露头角", sort_order: 2, created_at: "", updated_at: "" },
    ];
  }

  async *generateChronos(_timeline: TimelineNode[]): AsyncIterable<string> {
    yield* streamText("# 时空律\n\n（Mock 时空律内容）");
  }

  async generateCharacters(): Promise<CharacterCard[]> {
    await new Promise((r) => setTimeout(r, 800));
    const anthropoceneId = uuid();
    return [
      { id: uuid(), anthropocene_id: anthropoceneId, name: "白璃", faction: "天剑宗", motivation: "寻找父亲失踪的真相", personality: "沉稳内敛，不善言辞但内心炽热", habits: "独处时会摩挲残玉", quirks: "说话简短，极少用感叹词", relationships: null, sort_order: 0, created_at: "", updated_at: "" },
      { id: uuid(), anthropocene_id: anthropoceneId, name: "龙清瑶", faction: "万法阁", motivation: "证明女修不弱于男", personality: "骄傲、直率、有正义感", habits: "战斗前会整理发带", quirks: "喜欢用'哼'作为回应", relationships: null, sort_order: 1, created_at: "", updated_at: "" },
    ];
  }

  async *generateAnthropocene(_characters: CharacterCard[]): AsyncIterable<string> {
    yield* streamText("# 众生相\n\n（Mock 众生相内容）");
  }

  async generateChapterOutlines(): Promise<ChapterOutline[]> {
    await new Promise((r) => setTimeout(r, 800));
    const projectId = uuid();
    return [
      { id: uuid(), project_id: projectId, chapter_number: 1, title: "残玉", brief_description: "主角在边陲小镇偶得远古残玉", detailed_description: null, storyboard_status: "pending", storyboard_text: null, content: null, word_count: 0, writing_status: "not_started", sort_order: 0, created_at: "", updated_at: "" },
      { id: uuid(), project_id: projectId, chapter_number: 2, title: "入宗", brief_description: "主角离开小镇，前往天剑宗拜师", detailed_description: null, storyboard_status: "pending", storyboard_text: null, content: null, word_count: 0, writing_status: "not_started", sort_order: 1, created_at: "", updated_at: "" },
    ];
  }

  async *generateChapterDetail(_chapter: ChapterOutline): AsyncIterable<string> {
    yield* streamText("（Mock 章节详细描述，约500字）");
  }

  async generateStoryboard(_chapterDetail: string): Promise<StoryboardShot[]> {
    await new Promise((r) => setTimeout(r, 800));
    const chapterId = uuid();
    return [
      { id: uuid(), chapter_id: chapterId, shot_number: 1, characters: ["白璃"], location: "边陲小镇·集市", event: "白璃在集市闲逛", action_detail: "白璃穿过拥挤的人群", emotion_state: "平静中带着一丝迷茫", sort_order: 0, created_at: "", updated_at: "" },
    ];
  }

  async *generateStoryboardNarrative(_shots: StoryboardShot[]): AsyncIterable<string> {
    yield* streamText("（Mock 分镜描述文本）");
  }

  async *generateContinuation(_context: WritingContext): AsyncIterable<string> {
    yield* streamText("　　夜风裹挟着松脂的苦香穿过窗棂，将案上的烛火拉成一道细长的橙色丝线。白璃坐在窗前，指尖无意识地摩挲着那枚温润的残玉——那是父亲留给他的唯一遗物。");
  }
}

export const aiService: AIService = new MockAIService();
