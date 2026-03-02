"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";

const PUBLIC_PATHS = ["/", "/auth/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, isLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user && !PUBLIC_PATHS.includes(pathname)) {
        router.push("/auth/login");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user && !PUBLIC_PATHS.includes(pathname)) {
        router.push("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router, setUser]);

  // Show nothing while checking auth on protected routes
  if (isLoading && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-golden-pulse text-golden text-2xl">✦</div>
      </div>
    );
  }

  return <>{children}</>;
}
