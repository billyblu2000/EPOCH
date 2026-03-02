"use client";

import { useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { GenesisFormComponent } from "@/components/genesis/genesis-form";
import { GenesisArtifact } from "@/components/genesis/genesis-artifact";
import { useProjectStore } from "@/stores/project-store";
import type { GenesisForm } from "@/types";

type Phase = "form" | "generating" | "artifact" | "ritual" | "finalized";

async function* streamGenesisAPI(data: GenesisForm): AsyncIterable<string> {
  const res = await fetch("/api/ai/genesis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok || !res.body) {
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
    // 触发仪式动画
    setPhase("ritual");
    updateProjectStage(projectId, "theogony");

    // 仪式结束后进入定稿态
    setTimeout(() => {
      setPhase("finalized");
    }, 3000);
  }, [projectId, updateProjectStage]);

  const handleBackToForm = useCallback(() => {
    setPhase("form");
  }, []);

  return (
    <Container narrow className="py-12 relative">
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
            {/* 纪元图标光环 */}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="text-5xl mb-8 animate-halo"
            >
              ✦
            </motion.span>

            
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
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

            {/* 底部金色流光线 */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
              className="mt-10 h-[1px] w-48 bg-gradient-to-r from-transparent via-golden/40 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- 页面标题 ---- */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center mb-12"
      >
        <span className="text-4xl mb-6 animate-halo">✦</span>
        <div className="relative flex flex-col items-center">
          
          <h1 className="font-serif text-5xl sm:text-6xl text-foreground tracking-[0.25em] font-bold">
            创世纪
          </h1>
          {/* 英文悬浮于中文之上 */}
          <p className="text-[10px] font-light tracking-[0.6em] text-golden/50 uppercase mb-1 translate-y-1">
            — G E N E S I S —
          </p>
          {/* 底部装饰线 */}
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

      {/* ---- 阶段切换 ---- */}
      <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="rounded-lg border border-border/60 bg-card shadow-sm p-8 sm:p-10">
              <GenesisFormComponent
                onSubmit={handleGenerate}
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
        )}

        {(phase === "generating" || phase === "artifact" || phase === "finalized") && (
          <motion.div
            key="artifact"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- 定稿后导航 ---- */}
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
    </Container>
  );
}
