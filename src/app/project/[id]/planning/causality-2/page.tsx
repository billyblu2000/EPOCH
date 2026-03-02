"use client";

import { Container } from "@/components/layout/container";

export default function Causality2Page() {
  return (
    <Container narrow className="py-12">
      <div className="flex flex-col items-center mb-10">
        <span className="text-3xl mb-3">▣</span>
        <h1 className="font-serif text-2xl text-foreground">因果二纪</h1>
        <p className="mt-1 text-xs tracking-wider text-golden">Causality II</p>
        <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
          将每章剧情转化为详细的分镜脚本，作为正文写作的直接提示源。
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-sm text-muted-foreground">
          因果二纪将在 M6 里程碑中实现
        </p>
      </div>
    </Container>
  );
}
