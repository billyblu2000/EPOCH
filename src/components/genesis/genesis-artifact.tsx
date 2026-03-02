"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface GenesisArtifactProps {
  text: string;
  isGenerating: boolean;
  isFinalized: boolean;
  onTextChange: (text: string) => void;
  onRegenerate: () => void;
  onFinalize: () => void;
  onBackToForm?: () => void;
}

export function GenesisArtifact({
  text,
  isGenerating,
  isFinalized,
  onTextChange,
  onRegenerate,
  onFinalize,
}: GenesisArtifactProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGenerating && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text, isGenerating]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  return (
    <div className="space-y-8">
      {/* 标题区 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-lg text-foreground tracking-wide">《创世书》</h2>
          {isFinalized && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-golden/10 border border-golden/20 px-3 py-1 text-[11px] text-golden font-medium"
            >
              <Lock className="h-3 w-3" />
              已定稿
            </motion.span>
          )}
        </div>
        {isGenerating && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-golden animate-spirit" style={{ animationDelay: "0s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-golden animate-spirit" style={{ animationDelay: "0.3s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-golden animate-spirit" style={{ animationDelay: "0.6s" }} />
            </div>
            <span className="text-xs text-golden/80 font-serif tracking-wider">
              万物正在成形
            </span>
          </div>
        )}
      </motion.div>

      {/* 创世书内容区 */}
      <div
        ref={containerRef}
        className={`relative rounded-lg border bg-card overflow-hidden transition-all duration-500 ${
          isGenerating
            ? "border-golden/30 animate-breath shadow-[0_0_40px_rgba(180,130,70,0.08)]"
            : isFinalized
              ? "border-golden/20 shadow-[0_0_20px_rgba(180,130,70,0.05)]"
              : "border-border"
        }`}
      >
        {/* 生成中顶部流光条 */}
        {isGenerating && (
          <div className="absolute top-0 left-0 right-0 h-[2px] shimmer-golden shimmer-golden-animate" />
        )}

        {isFinalized ? (
          <div className="p-8 writing-area whitespace-pre-wrap text-sm leading-[2] text-foreground/90 min-h-[400px] mx-auto">
            {text}
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            disabled={isGenerating}
            className="min-h-[400px] resize-none border-0 p-8 text-sm leading-[2] focus-visible:ring-0 writing-area mx-auto"
            placeholder="AI 生成的创世书将出现在这里..."
          />
        )}

        {/* 生成中：尾部光标 */}
        {isGenerating && text && (
          <div className="px-8 pb-6">
            <span className="animate-cursor" />
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <AnimatePresence>
        {!isGenerating && text && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {!isFinalized && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                  重新生成
                </Button>
              )}
            </div>

            {!isFinalized && (
              <button
                onClick={onFinalize}
                className="btn-finalize inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(180,130,70,0.30)]"
              >
                <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="font-serif">完成创世纪</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 字数统计 */}
      {text && (
        <div className="text-right">
          <span className="text-[11px] text-muted-foreground/60 tracking-wider">
            {text.length.toLocaleString()} 字
          </span>
        </div>
      )}
    </div>
  );
}
