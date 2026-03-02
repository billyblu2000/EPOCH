// ============================================================
// AI 模型配置 — 按步骤指定最合适的模型
// ============================================================

export interface ModelConfig {
  provider: string;      // 服务商标识：siliconflow, openai, deepseek 等
  model: string;         // 模型 ID
  baseURL: string;       // API base URL
  temperature?: number;
  maxTokens?: number;
}

// 各步骤的模型配置（系统写死，用户不可配置）
const MODEL_REGISTRY: Record<string, ModelConfig> = {
  // 创世纪 — 需要强推理 + 创意能力
  genesis: {
    provider: "siliconflow",
    model: "Pro/MiniMaxAI/MiniMax-M2.5",
    baseURL: "https://api.siliconflow.cn/v1",
    temperature: 0.8,
    maxTokens: 4096,
  },

  // 神世纪 — 世界观构建
  theogony: {
    provider: "siliconflow",
    model: "Pro/MiniMaxAI/MiniMax-M2.5",
    baseURL: "https://api.siliconflow.cn/v1",
    temperature: 0.7,
    maxTokens: 4096,
  },

  // 时空纪 — 时间线设计
  chronos: {
    provider: "siliconflow",
    model: "Pro/MiniMaxAI/MiniMax-M2.5",
    baseURL: "https://api.siliconflow.cn/v1",
    temperature: 0.7,
    maxTokens: 4096,
  },

  // 人世纪 — 角色设计
  anthropocene: {
    provider: "siliconflow",
    model: "Pro/MiniMaxAI/MiniMax-M2.5",
    baseURL: "https://api.siliconflow.cn/v1",
    temperature: 0.8,
    maxTokens: 4096,
  },

  // 因果一纪 — 大纲
  causality_outline: {
    provider: "siliconflow",
    model: "Pro/MiniMaxAI/MiniMax-M2.5",
    baseURL: "https://api.siliconflow.cn/v1",
    temperature: 0.7,
    maxTokens: 4096,
  },

  // 因果二纪 — 分镜
  causality_storyboard: {
    provider: "siliconflow",
    model: "Pro/MiniMaxAI/MiniMax-M2.5",
    baseURL: "https://api.siliconflow.cn/v1",
    temperature: 0.7,
    maxTokens: 4096,
  },

  // 写作续写 — 需要文笔
  writing: {
    provider: "siliconflow",
    model: "Pro/MiniMaxAI/MiniMax-M2.5",
    baseURL: "https://api.siliconflow.cn/v1",
    temperature: 0.9,
    maxTokens: 2048,
  },

  // 默认
  default: {
    provider: "siliconflow",
    model: "Pro/MiniMaxAI/MiniMax-M2.5",
    baseURL: "https://api.siliconflow.cn/v1",
    temperature: 0.7,
    maxTokens: 4096,
  },
};

/**
 * 获取指定步骤的模型配置
 */
export function getModelConfig(step: string): ModelConfig {
  return MODEL_REGISTRY[step] || MODEL_REGISTRY.default;
}

/**
 * 所有已知的 AI 服务商
 */
export const AI_PROVIDERS = [
  {
    id: "siliconflow",
    name: "SiliconFlow",
    baseURL: "https://api.siliconflow.cn/v1",
    description: "硅基流动 — 支持多种开源/商业模型",
  },
  {
    id: "openai",
    name: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    description: "OpenAI — GPT 系列模型",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    baseURL: "https://api.deepseek.com/v1",
    description: "DeepSeek — 高性价比推理模型",
  },
] as const;

export type ProviderId = (typeof AI_PROVIDERS)[number]["id"];
