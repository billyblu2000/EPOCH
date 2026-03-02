"use client";

import Link from "next/link";
import { Feather } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <Feather className="h-5 w-5 text-golden transition-colors group-hover:text-golden-light" strokeWidth={1.5} />
          <span className="font-serif text-lg tracking-wide text-foreground">
            纪元
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">人筑骨，机填肉</span>
        </nav>
      </div>
    </header>
  );
}
