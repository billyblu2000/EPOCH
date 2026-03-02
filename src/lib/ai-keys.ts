// ============================================================
// AI API Keys — 存储在浏览器 localStorage
// ============================================================

const STORAGE_KEY = "epoch_ai_keys";

export interface AIKeyConfig {
  siliconflow?: string;
  openai?: string;
  deepseek?: string;
}

export function getAIKeys(): AIKeyConfig {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setAIKeys(keys: AIKeyConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function getProviderKey(provider: string): string | undefined {
  const keys = getAIKeys();
  return keys[provider as keyof AIKeyConfig];
}
