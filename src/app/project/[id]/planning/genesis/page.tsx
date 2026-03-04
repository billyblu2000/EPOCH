"use client";

import { useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
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

  // 是否已经生成过（用于表单按钮文案切换）
  const hasGenerated = phase === "artifact" || phase === "finalized";

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

  const handleFinalize = useCallback(() => {
    setPhase("ritual");
    updateProjectStage(projectId, "theogony");

    setTimeout(() => {
      setPhase("finalized");
    }, 3000);
  }, [projectId, updateProjectStage]);

  // 是否显示双栏布局（非仪式态都显示）
  const showTwoColumn = phase !== "ritual";
  // 是否有 AI 内容可展示
  const hasArtifact = phase === "generating" || phase === "artifact" || phase === "finalized";

  return (
    <div className="relative h-[calc(100vh-3.5rem)]">
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
        <div className="flex h-full">
          {/* ======== 左栏：创世书展示区 ======== */}
          <div className="flex-1 min-w-0 flex flex-col border-r border-border/40">
            {/* 左栏头部 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="shrink-0 px-8 py-5 border-b border-border/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg animate-halo">✦</span>
                  <h1 className="font-serif text-xl text-foreground tracking-wide">
                    创世纪
                    <span className="text-muted-foreground/40 mx-2 font-light">·</span>
                    <span className="text-golden/80">创世书</span>
                  </h1>
                  {isGenerating && (
                    <div className="flex items-center gap-2 ml-3">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-golden animate-spirit" style={{ animationDelay: "0s" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-golden animate-spirit" style={{ animationDelay: "0.3s" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-golden animate-spirit" style={{ animationDelay: "0.6s" }} />
                      </div>
                      <span className="text-xs text-golden/70 font-serif tracking-wider">万物正在成形</span>
                    </div>
                  )}
                  {phase === "finalized" && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-golden/10 border border-golden/20 px-3 py-1 text-[11px] text-golden font-medium ml-3"
                    >
                      <Lock className="h-3 w-3" />
                      已定稿
                    </motion.span>
                  )}
                </div>
                {/* 字数统计 */}
                {artifactText && (
                  <span className="text-[11px] text-muted-foreground/50 tracking-wider">
                    {artifactText.length.toLocaleString()} 字
                  </span>
                )}
              </div>
            </motion.div>

            {/* 左栏可滚动内容区 */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-8 py-6">
                <AnimatePresence mode="wait">
                  {hasArtifact ? (
                    <motion.div
                      key="artifact"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.4, ease: "easeOut" as const }}
                    >
                      <GenesisArtifact
                        text={artifactText}
                        isGenerating={isGenerating}
                        isFinalized={phase === "finalized"}
                        onTextChange={setArtifactText}
                        onFinalize={handleFinalize}
                      />

                      {/* 定稿后导航 */}
                      {phase === "finalized" && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="mt-12 flex flex-col items-center pb-8"
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
                      className="flex flex-col items-center justify-center h-full min-h-[400px]"
                    >
                      <div className="flex flex-col items-center gap-4 text-muted-foreground/40">
                        <span className="text-5xl animate-halo">✦</span>
                        <p className="font-serif text-sm tracking-wider">《创世书》将在此显现</p>
                        <p className="text-xs text-muted-foreground/30">填写右侧表单后，点击「AI 创世」开始生成</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ======== 右栏：表单区 ======== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-[460px] shrink-0 flex flex-col bg-card/50"
          >
            {/* 右栏头部 */}
            <div className="shrink-0 px-7 py-5 border-b border-border/40">
            </div>

            {/* 右栏可滚动内容区 */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-7 py-6">
                <GenesisFormComponent
                  onSubmit={handleGenerate}
                  isDisabled={isGenerating}
                  isRegenerate={hasGenerated}
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
                    notes: formData.notes,
                  } : undefined}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
