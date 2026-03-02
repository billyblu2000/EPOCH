"use client";

import { Container } from "@/components/layout/container";

export default function TheogonyPage() {
  return (
    <Container narrow className="py-12">
      <div className="flex flex-col items-center mb-10">
        <span className="text-3xl mb-3">◈</span>
        <h1 className="font-serif text-2xl text-foreground">神世纪</h1>
        <p className="mt-1 text-xs tracking-wider text-golden">Theogony</p>
        <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
          完成世界观的全面构建，如同神明塑造世界。AI 将根据《创世书》生成动态世界观字段。
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-sm text-muted-foreground">
          神世纪将在 M2 里程碑中实现
        </p>
      </div>
    </Container>
  );
}
