"use client";

import { Container } from "@/components/layout/container";

export default function ChronosPage() {
  return (
    <Container narrow className="py-12">
      <div className="flex flex-col items-center mb-10">
        <span className="text-3xl mb-3">◉</span>
        <h1 className="font-serif text-2xl text-foreground">时空纪</h1>
        <p className="mt-1 text-xs tracking-wider text-golden">Chronos</p>
        <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
          构建小说的完整剧情时间线。通过可视化时间轴，明确全部剧情走向。
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-sm text-muted-foreground">
          时空纪将在 M3 里程碑中实现
        </p>
      </div>
    </Container>
  );
}
