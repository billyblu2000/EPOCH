"use client";

import { Container } from "@/components/layout/container";

export default function AnthropocenePage() {
  return (
    <Container narrow className="py-12">
      <div className="flex flex-col items-center mb-10">
        <span className="text-3xl mb-3">◎</span>
        <h1 className="font-serif text-2xl text-foreground">人世纪</h1>
        <p className="mt-1 text-xs tracking-wider text-golden">Anthropocene</p>
        <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
          推演并定义所有人物的完整人物卡，构建角色关系网络。
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-sm text-muted-foreground">
          人世纪将在 M4 里程碑中实现
        </p>
      </div>
    </Container>
  );
}
