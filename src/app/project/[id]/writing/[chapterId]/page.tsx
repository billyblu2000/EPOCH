"use client";

import { useParams } from "next/navigation";

export default function WritingChapterPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* 左翼：命理镜 */}
      <aside className="w-64 border-r border-border bg-background p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
          命理镜 · 分镜流
        </p>
        <p className="text-sm text-muted-foreground/70">M7 里程碑实现</p>
      </aside>

      {/* 中轴：创作区域 */}
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl px-8 py-12">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-xl text-foreground">第一章 · 残玉</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              主角在边陲小镇偶得远古残玉
            </p>
          </div>
          <div className="min-h-[60vh] rounded-lg border border-border bg-card p-8">
            <p className="text-sm text-muted-foreground">
              写作编辑器（章节 {chapterId}）将在 M7 里程碑中实现
            </p>
          </div>
        </div>
      </main>

      {/* 右翼：众生相 */}
      <aside className="w-64 border-l border-border bg-background p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
          众生相 · 人物卡
        </p>
        <p className="text-sm text-muted-foreground/70">M7 里程碑实现</p>
      </aside>
    </div>
  );
}
