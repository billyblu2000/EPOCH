"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Feather } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
        <Feather className="h-12 w-12 text-golden animate-golden-pulse" strokeWidth={1} />
        <h1 className="font-serif text-4xl tracking-widest text-foreground">
          纪元
        </h1>
        <p className="text-sm tracking-wider text-muted-foreground">
          人筑骨，机填肉
        </p>
        <div className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-golden/30 to-transparent" />
      </div>
    </div>
  );
}
