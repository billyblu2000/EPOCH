# 技术栈与架构设计

## 一、整体架构

```
┌─────────────────────────────────────────────────┐
│                  Vercel (Hosting)                │
│  ┌───────────────────┐  ┌────────────────────┐  │
│  │   React SPA       │  │  Edge Functions    │  │
│  │   (Next.js)       │  │  (API 代理层)       │  │
│  │                   │  │  - AI API 中转      │  │
│  │  - Planning UI    │  │  - 敏感操作处理     │  │
│  │  - Writing Editor │  │                    │  │
│  │  - State Mgmt     │  │                    │  │
│  └───────┬───────────┘  └─────────┬──────────┘  │
│          │                        │              │
└──────────┼────────────────────────┼──────────────┘
           │                        │
           ▼                        ▼
┌─────────────────────┐  ┌─────────────────────┐
│    Supabase         │  │    LLM API          │
│  - PostgreSQL       │  │  (预留接口, 暂用     │
│  - Auth             │  │   Mock 数据)         │
│  - Row Level Security│ │                     │
│  - Realtime (未来)   │  │                     │
└─────────────────────┘  └─────────────────────┘
```

## 二、前端技术栈

| 技术 | 选型 | 说明 |
|------|------|------|
| 框架 | **Next.js 14+ (App Router)** | React 全栈框架，完美适配 Vercel |
| 语言 | **TypeScript** | 类型安全，大型项目必备 |
| 样式 | **Tailwind CSS** | 原子化 CSS，快速构建 UI |
| 状态管理 | **Zustand** | 轻量、简洁，适合中大型应用 |
| 富文本编辑器 | **Tiptap** | 基于 ProseMirror，高度可扩展，适合自定义 `#` / `@` 语法 |
| UI 组件 | **shadcn/ui** | 基于 Radix UI，可深度定制，美观现代 |
| 表单处理 | **React Hook Form + Zod** | 动态表单验证，适合六大纪元的结构化输入 |
| 图标 | **Lucide React** | 与 shadcn/ui 配套，strokeWidth 1.5 |
| 字体 | **Inter + Noto Serif SC** | 界面用 Inter，纪元标题与写作区用 Noto Serif SC |
| 动效 | **Framer Motion** | 纪元过渡仪式动画、AI 生成呼吸光效 |

> 📐 完整视觉规范见 [`07-design-system.md`](./07-design-system.md)：色彩体系、排版、神性设计语言、组件风格指南。

## 三、后端 / BaaS

| 技术 | 选型 | 说明 |
|------|------|------|
| 数据库 | **Supabase (PostgreSQL)** | 免费层够用，内置 Auth 和 RLS |
| 认证 | **Supabase Auth** | 邮箱/OAuth 登录 |
| API 代理 | **Vercel Edge Functions** | 中转 AI API 调用，保护 API Key |
| 文件存储 | **Supabase Storage**（未来） | 导出文件、封面图等 |

## 四、AI 接口设计

### 当前阶段：Mock 模式
- 所有 AI 调用通过统一的 `AIService` 接口层。
- 当前实现为 Mock：返回预设的模拟文本，模拟打字机效果（流式输出）。
- Mock 数据应尽量真实，便于测试完整流程。

### 未来接入：真实 LLM
```typescript
// AI Service 接口定义
interface AIService {
  // 创世纪：根据结构化输入生成创世书
  generateGenesis(input: GenesisForm): AsyncIterable<string>;
  
  // 神世纪：根据创世书生成动态字段
  generateTheogonyFields(genesis: string): Promise<DynamicField[]>;
  // 神世纪：根据字段生成神世法
  generateTheogony(fields: DynamicField[], genesis: string): AsyncIterable<string>;
  
  // 时空纪：生成时间线
  generateTimeline(genesis: string, theogony: string): Promise<TimelineNode[]>;
  // 时空纪：生成时空律
  generateChronos(timeline: TimelineNode[], ...artifacts: string[]): AsyncIterable<string>;
  
  // 人世纪：生成人物卡
  generateCharacters(...artifacts: string[]): Promise<CharacterCard[]>;
  // 人世纪：生成众生相
  generateAnthropocene(characters: CharacterCard[], ...artifacts: string[]): AsyncIterable<string>;
  
  // 因果一纪：生成章节框架
  generateChapterOutlines(...artifacts: string[]): Promise<ChapterOutline[]>;
  // 因果一纪：生成章节详细描述
  generateChapterDetail(chapter: ChapterOutline, ...artifacts: string[]): AsyncIterable<string>;
  
  // 因果二纪：生成分镜
  generateStoryboard(chapterDetail: string, ...artifacts: string[]): Promise<StoryboardShot[]>;
  // 因果二纪：生成分镜描述
  generateStoryboardNarrative(shots: StoryboardShot[], ...artifacts: string[]): AsyncIterable<string>;
  
  // 写作空间：续写
  generateContinuation(context: WritingContext): AsyncIterable<string>;
}
```

### Prompt 工程
- 每个纪元的 Prompt 模板存储在 Supabase 或代码中。
- Prompt 遵循结构：`[系统角色] + [前序产出物摘要] + [当前输入] + [输出格式要求]`。
- 写作空间的 Prompt 自动打包逻辑见 `03-writing-workspace.md`。

## 五、项目结构（预期）

```
EPOCH/
├── guide/                    # 项目文档（当前）
├── src/
│   ├── app/                  # Next.js App Router 页面
│   │   ├── (auth)/           # 登录/注册页面
│   │   ├── dashboard/        # 项目列表/管理
│   │   ├── project/[id]/     # 单个项目
│   │   │   ├── planning/     # Planning Pipeline
│   │   │   │   ├── genesis/
│   │   │   │   ├── theogony/
│   │   │   │   ├── chronos/
│   │   │   │   ├── anthropocene/
│   │   │   │   ├── causality-1/
│   │   │   │   └── causality-2/
│   │   │   └── writing/      # Writing Workspace
│   │   │       └── [chapterId]/
│   │   └── layout.tsx
│   ├── components/           # 通用组件
│   │   ├── ui/               # shadcn/ui 基础组件
│   │   ├── planning/         # Planning Pipeline 组件
│   │   ├── writing/          # Writing Workspace 组件
│   │   └── layout/           # 布局组件
│   ├── lib/                  # 工具库
│   │   ├── supabase/         # Supabase 客户端与工具
│   │   ├── ai/               # AI Service 层（含 Mock）
│   │   └── utils/            # 通用工具函数
│   ├── stores/               # Zustand 状态管理
│   ├── types/                # TypeScript 类型定义
│   └── styles/               # 全局样式
├── supabase/                 # Supabase 本地配置与迁移
│   └── migrations/
├── public/                   # 静态资源
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
