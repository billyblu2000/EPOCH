"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, X, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { genesisFormSchema, type GenesisFormValues } from "@/lib/validations/genesis";
import type { GenesisForm as GenesisFormType } from "@/types";

interface GenesisFormProps {
  onSubmit: (data: GenesisFormType) => void;
  defaultValues?: Partial<GenesisFormValues>;
  isDisabled?: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export function GenesisFormComponent({ onSubmit, defaultValues, isDisabled }: GenesisFormProps) {
  const [traitInput, setTraitInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<GenesisFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(genesisFormSchema) as any,
    defaultValues: {
      genre: "",
      target_reader: "",
      perspective: "",
      protagonist: { gender: "", age_range: "", traits: [] },
      chapter_word_target: null,
      total_chapters: null,
      total_word_target: null,
      pacing_model: "",
      novel_function: "",
      core_synopsis: "",
      basic_worldview: "",
      ...defaultValues,
    },
  });

  const traits = watch("protagonist.traits") || [];

  const addTrait = () => {
    const t = traitInput.trim();
    if (t && !traits.includes(t)) {
      setValue("protagonist.traits", [...traits, t]);
      setTraitInput("");
    }
  };

  const removeTrait = (trait: string) => {
    setValue("protagonist.traits", traits.filter((tt) => tt !== trait));
  };

  const onFormSubmit = (data: GenesisFormValues) => {
    const formData: GenesisFormType = {
      genre: data.genre,
      target_reader: data.target_reader,
      perspective: data.perspective,
      protagonist: {
        gender: data.protagonist.gender,
        age_range: data.protagonist.age_range,
        traits: data.protagonist.traits,
      },
      chapter_word_target: data.chapter_word_target,
      total_chapters: data.total_chapters,
      total_word_target: data.total_word_target,
      pacing_model: data.pacing_model,
      novel_function: data.novel_function,
      core_synopsis: data.core_synopsis,
      basic_worldview: data.basic_worldview,
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-12">
      {/* ---- 基础信息 ---- */}
      <motion.section custom={0} initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="divider-divine mb-6">
          <h2 className="font-serif text-sm tracking-[0.2em] text-muted-foreground whitespace-nowrap">基础信息</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="genre">
              题材 <span className="text-golden/70 text-[10px] font-normal">推荐填写</span>
            </Label>
            <Input
              id="genre"
              placeholder="如：仙侠、都市、科幻、悬疑..."
              disabled={isDisabled}
              className="input-divine"
              {...register("genre")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_reader">目标读者</Label>
            <Input
              id="target_reader"
              placeholder="如：男频、女频、全年龄..."
              disabled={isDisabled}
              className="input-divine"
              {...register("target_reader")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="perspective">
              叙事视角 <span className="text-golden/70 text-[10px] font-normal">推荐填写</span>
            </Label>
            <Input
              id="perspective"
              placeholder="如：第一人称、第三人称有限、上帝视角..."
              disabled={isDisabled}
              className="input-divine"
              {...register("perspective")}
            />
          </div>
        </div>

        {/* 主人公特质 */}
        <div className="mt-7 rounded-lg border border-border/70 bg-gradient-to-b from-card to-secondary/30 p-6">
          <h3 className="font-serif text-sm text-foreground mb-5 tracking-wide">
            主人公基础特质 <span className="text-golden/70 text-[10px] font-sans font-normal">推荐填写</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="space-y-2">
              <Label htmlFor="protagonist.gender" className="text-xs">性别</Label>
              <Input
                id="protagonist.gender"
                placeholder="如：男、女..."
                disabled={isDisabled}
                className="input-divine"
                {...register("protagonist.gender")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protagonist.age_range" className="text-xs">年龄段</Label>
              <Input
                id="protagonist.age_range"
                placeholder="如：少年、青年、中年..."
                disabled={isDisabled}
                className="input-divine"
                {...register("protagonist.age_range")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">核心性格标签</Label>
            <div className="flex flex-wrap gap-2 min-h-[28px] mb-2">
              {traits.map((trait) => (
                <Badge key={trait} variant="outline" className="gap-1 pr-1.5 text-foreground/80 border-golden/20 bg-golden/5">
                  {trait}
                  {!isDisabled && (
                    <button
                      type="button"
                      onClick={() => removeTrait(trait)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {!isDisabled && (
              <div className="flex gap-2">
                <Input
                  placeholder="输入性格标签后回车，如：坚韧、内敛、桀骜..."
                  value={traitInput}
                  onChange={(e) => setTraitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTrait();
                    }
                  }}
                  className="flex-1 input-divine"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTrait} className="shrink-0">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* ---- 工程指标 ---- */}
      <motion.section custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="divider-divine mb-6">
          <h2 className="font-serif text-sm tracking-[0.2em] text-muted-foreground whitespace-nowrap">工程指标</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label htmlFor="chapter_word_target" className="text-xs">单章目标字数</Label>
            <Input
              id="chapter_word_target"
              type="number"
              placeholder="如：3000"
              disabled={isDisabled}
              className="input-divine"
              {...register("chapter_word_target")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_chapters" className="text-xs">总目标章节数</Label>
            <Input
              id="total_chapters"
              type="number"
              placeholder="如：200"
              disabled={isDisabled}
              className="input-divine"
              {...register("total_chapters")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_word_target" className="text-xs">总目标字数</Label>
            <Input
              id="total_word_target"
              type="number"
              placeholder="如：600000"
              disabled={isDisabled}
              className="input-divine"
              {...register("total_word_target")}
            />
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="pacing_model" className="text-xs">内容分配计划</Label>
          <Input
            id="pacing_model"
            placeholder="如：开篇20%铺垫 → 30%发展 → 30%高潮 → 20%收束"
            disabled={isDisabled}
            className="input-divine"
            {...register("pacing_model")}
          />
          <p className="text-[11px] text-muted-foreground/70">描述全书的节奏与结构分配</p>
        </div>
      </motion.section>

      {/* ---- 核心灵魂 ---- */}
      <motion.section custom={2} initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="divider-divine mb-6">
          <h2 className="font-serif text-sm tracking-[0.2em] text-muted-foreground whitespace-nowrap">核心灵魂</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="novel_function">
              小说功能 <span className="text-golden/70 text-[10px] font-normal">推荐填写</span>
            </Label>
            <Input
              id="novel_function"
              placeholder="如：治愈、解压、感官刺激、深度思考..."
              disabled={isDisabled}
              className="input-divine"
              {...register("novel_function")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="core_synopsis">
              核心大纲 <span className="text-golden/70 text-[10px] font-normal">推荐填写</span>
            </Label>
            <Textarea
              id="core_synopsis"
              placeholder="主要讲了一个什么故事？不需要完善，骨架即可..."
              rows={5}
              disabled={isDisabled}
              className="input-divine resize-none"
              {...register("core_synopsis")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="basic_worldview">基础世界观</Label>
            <Textarea
              id="basic_worldview"
              placeholder="故事发生的基本背景设定..."
              rows={4}
              disabled={isDisabled}
              className="input-divine resize-none"
              {...register("basic_worldview")}
            />
          </div>
        </div>
      </motion.section>

      {/* 提示 */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="rounded-lg border border-golden/15 bg-gradient-to-r from-golden/[0.03] via-transparent to-golden/[0.03] p-5"
      >
        <p className="text-xs text-muted-foreground leading-relaxed text-center">
          所有字段均可留空。AI 会根据已填内容进行脑补补全，生成完整的《创世书》。
          <br />
          <span className="text-golden/60">填写得越详细，AI 生成的内容与你的意图越接近。</span>
        </p>
      </motion.div>

      {/* 创世按钮 */}
      {!isDisabled && (
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="flex justify-center pt-4 pb-2"
        >
          <button
            type="submit"
            className="btn-genesis group relative inline-flex items-center gap-2.5 rounded-lg px-10 py-3.5 text-sm font-medium text-white tracking-wide transition-all duration-300"
          >
            <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" strokeWidth={1.5} />
            <span className="font-serif tracking-widest">AI 创世</span>
          </button>
        </motion.div>
      )}
    </form>
  );
}
