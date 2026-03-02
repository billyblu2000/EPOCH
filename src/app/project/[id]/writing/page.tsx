"use client";

import { Container } from "@/components/layout/container";

export default function WritingIndexPage() {
  return (
    <Container className="py-12">
      <div className="flex flex-col items-center mb-10">
        <span className="text-3xl mb-3">✍</span>
        <h1 className="font-serif text-2xl text-foreground">写作空间</h1>
        <p className="mt-1 text-xs tracking-wider text-golden">Writing Workspace</p>
        <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
          沉浸式三栏编辑器，选择一个章节开始创作。
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <p className="text-center text-sm text-muted-foreground">
          写作空间将在 M7 里程碑中实现
        </p>
      </div>
    </Container>
  );
}
