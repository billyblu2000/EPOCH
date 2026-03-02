"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface GenesisArtifactProps {
  text: string;
  isGenerating: boolean;
  isFinalized: boolean;
  onTextChange: (text: string) => void;
  onFinalize: () => void;
}

export function GenesisArtifact({
  text,
  isGenerating,
  isFinalized,
  onTextChange,
  onFinalize,
}: GenesisArtifactProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  return (
    <div className="space-y-6">
      {/* 创世书内容区 */}
      <div
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
          <div className="p-8 writing-area whitespace-pre-wrap text-sm leading-[2] text-foreground/90 min-h-[300px] mx-auto">
            {text}
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            disabled={isGenerating}
            className="min-h-[300px] resize-none border-0 p-8 text-sm leading-[2] focus-visible:ring-0 writing-area mx-auto"
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

      {/* 完成纪元按钮 */}
      <AnimatePresence>
        {!isGenerating && text && !isFinalized && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-end"
          >
            <button
              onClick={onFinalize}
              className="btn-finalize inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(180,130,70,0.30)]"
            >
              <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="font-serif">完成创世纪</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
