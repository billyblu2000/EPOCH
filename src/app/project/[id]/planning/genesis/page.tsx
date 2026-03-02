"use client";

import { useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GenesisFormComponent } from "@/components/genesis/genesis-form";
import { GenesisArtifact } from "@/components/genesis/genesis-artifact";
import { useProjectStore } from "@/stores/project-store";
import { getProviderKey } from "@/lib/ai-keys";
import { getModelConfig } from "@/lib/ai/model-config";
import type { GenesisForm } from "@/types";

type Phase = "form" | "generating" | "artifact" | "ritual" | "finalized";

async function* streamGenesisAPI(data: GenesisForm): AsyncIterable<string> {
  const config = getModelConfig("genesis");
  const apiKey = getProviderKey(config.provider);
  if (!apiKey) {
    throw new Error("未配置 AI API Key。请点击右上角头像 → 设置，配置 API Key。");
  }

  const res = await fetch("/api/ai/genesis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-ai-api-key": apiKey,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok || !res.body) {
    if (res.status === 401) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || "未配置 API Key");
    }
    throw new Error(`API error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}

export default function GenesisPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [phase, setPhase] = useState<Phase>("form");
  const [artifactText, setArtifactText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<GenesisForm | null>(null);
  const abortRef = useRef(false);

  const updateProjectStage = useProjectStore((s) => s.updateProjectStage);

  const handleGenerate = useCallback(
    async (data: GenesisForm) => {
      setFormData(data);
      setPhase("generating");
      setIsGenerating(true);
      setArtifactText("");
      abortRef.current = false;

      let buffer = "";
      try {
        for await (const chunk of streamGenesisAPI(data)) {
          if (abortRef.current) break;
          buffer += chunk;
          setArtifactText(buffer);
        }
      } catch (err) {
        console.error("Generation error:", err);
      } finally {
        setIsGenerating(false);
        setPhase("artifact");
      }
    },
    []
  );

  const handleRegenerate = useCallback(() => {
    if (formData) {
      handleGenerate(formData);
    }
  }, [formData, handleGenerate]);

  const handleFinalize = useCallback(() => {
    setPhase("ritual");
    updateProjectStage(projectId, "theogony");

    setTimeout(() => {
      setPhase("finalized");
    }, 3000);
  }, [projectId, updateProjectStage]);

  const handleBackToForm = useCallback(() => {
    setPhase("form");
  }, []);

  // 是否显示双栏布局（非仪式态都显示）
  const showTwoColumn = phase !== "ritual";
  // 是否有 AI 内容可展示
  const hasArtifact = phase === "generating" || phase === "artifact" || phase === "finalized";

  return (
    <div className="relative min-h-screen">
      {/* ---- 纪元完成仪式遮罩 ---- */}
      <AnimatePresence>
        {phase === "ritual" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" as const }}
              className="text-5xl mb-8 animate-halo"
            >
              ✦
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" as const }}
              className="font-serif text-4xl sm:text-5xl tracking-[0.4em] text-foreground/90 font-bold"
            >
              创世已成
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-5 font-serif text-sm tracking-[0.3em] text-golden"
            >
              万物有法 · 诸相初定
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" as const }}
              className="mt-10 h-[1px] w-48 bg-gradient-to-r from-transparent via-golden/40 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showTwoColumn && (
        <div className="mx-auto w-full max-w-[1600px] px-6 py-8">
          {/* ---- 页面标题 ---- */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="flex flex-col items-center mb-10"
          >
            <span className="text-4xl mb-6 animate-halo">✦</span>
            <div className="relative flex flex-col items-center">
              <h1 className="font-serif text-5xl sm:text-6xl text-foreground tracking-[0.25em] font-bold">
                创世纪
              </h1>
              <p className="text-[10px] font-light tracking-[0.6em] text-golden/50 uppercase mb-1 translate-y-1">
                — G E N E S I S —
              </p>
              <div className="mt-3 h-[1px] w-24 bg-gradient-to-r from-transparent via-golden/40 to-transparent" />
            </div>
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-5 text-sm text-muted-foreground text-center max-w-md leading-relaxed"
            >
              {phase === "form"
                ? "构建小说的核心中的核心，奠定全书基调。AI 将为你生成《创世书》——全书最高宪法。"
                : phase === "finalized"
                  ? "《创世书》已定稿为全书最高宪法。"
                  : "AI 正在推演万物之初的法则..."}
            </motion.p>
          </motion.div>

          {/* ---- 双栏布局 ---- */}
          <div className="flex gap-8">
            {/* 左栏：AI 生成区域 */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {hasArtifact ? (
                  <motion.div
                    key="artifact"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" as const }}
                  >
                    <GenesisArtifact
                      text={artifactText}
                      isGenerating={isGenerating}
                      isFinalized={phase === "finalized"}
                      onTextChange={setArtifactText}
                      onRegenerate={handleRegenerate}
                      onFinalize={handleFinalize}
                      onBackToForm={handleBackToForm}
                    />

                    {/* 定稿后导航 */}
                    {phase === "finalized" && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mt-12 flex flex-col items-center"
                      >
                        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-golden/30 to-transparent mb-8" />
                        <button
                          onClick={() => router.push(`/project/${projectId}/planning/theogony`)}
                          className="group relative font-serif text-sm text-golden/80 hover:text-golden transition-all duration-300"
                        >
                          <span className="tracking-wider">进入神世纪</span>
                          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                          <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-golden/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-lg border border-dashed border-border/50 bg-card/30"
                  >
                    <div className="flex flex-col items-center gap-4 text-muted-foreground/50">
                      <span className="text-4xl">✦</span>
                      <p className="font-serif text-sm tracking-wider">《创世书》将在此显现</p>
                      <p className="text-xs">填写右侧表单后，点击「AI 创世」开始生成</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 右栏：表单 */}
            <div className="w-[480px] shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
              >
                <div className="rounded-lg border border-border/60 bg-card shadow-sm p-6 sm:p-8 sticky top-24">
                  <GenesisFormComponent
                    onSubmit={handleGenerate}
                    isDisabled={isGenerating}
                    defaultValues={formData ? {
                      genre: formData.genre,
                      target_reader: formData.target_reader,
                      perspective: formData.perspective,
                      protagonist: formData.protagonist,
                      chapter_word_target: formData.chapter_word_target,
                      total_chapters: formData.total_chapters,
                      total_word_target: formData.total_word_target,
                      pacing_model: formData.pacing_model,
                      novel_function: formData.novel_function,
                      core_synopsis: formData.core_synopsis,
                      basic_worldview: formData.basic_worldview,
                    } : undefined}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
