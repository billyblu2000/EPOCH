"use client";

import { Container } from "@/components/layout/container";

export default function Causality1Page() {
  return (
    <Container narrow className="py-12">
      <div className="flex flex-col items-center mb-10">
        <span className="text-3xl mb-3">⟐</span>
        <h1 className="font-serif text-2xl text-foreground">因果一纪</h1>
        <p className="mt-1 text-xs tracking-wider text-golden">Causality I</p>
        <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
          将宏观剧情拆解为每一章的逻辑指令，生成章节大纲。
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-sm text-muted-foreground">
          因果一纪将在 M5 里程碑中实现
        </p>
      </div>
    </Container>
  );
}
