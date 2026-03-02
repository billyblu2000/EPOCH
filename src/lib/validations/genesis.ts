import { z } from "zod";

export const protagonistSchema = z.object({
  gender: z.string().default(""),
  age_range: z.string().default(""),
  traits: z.array(z.string()).default([]),
});

export const genesisFormSchema = z.object({
  // 基础信息
  genre: z.string().default(""),
  target_reader: z.string().default(""),
  perspective: z.string().default(""),
  protagonist: protagonistSchema.default({}),

  // 工程指标
  chapter_word_target: z.coerce.number().nullable().default(null),
  total_chapters: z.coerce.number().nullable().default(null),
  total_word_target: z.coerce.number().nullable().default(null),
  pacing_model: z.string().default(""),

  // 核心灵魂
  novel_function: z.string().default(""),
  core_synopsis: z.string().default(""),
  basic_worldview: z.string().default(""),
});

export type GenesisFormValues = z.infer<typeof genesisFormSchema>;
