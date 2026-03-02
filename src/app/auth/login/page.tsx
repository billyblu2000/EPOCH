"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Feather } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setError("注册成功！请查收验证邮件，或直接登录。");
        setMode("login");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "操作失败";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Feather
            className="h-10 w-10 text-golden mb-4"
            strokeWidth={1}
          />
          <h1 className="font-serif text-3xl tracking-widest text-foreground">
            纪元
          </h1>
          <p className="mt-2 text-xs text-muted-foreground tracking-wider">
            AI 协作长篇小说创作系统
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs tracking-wider text-muted-foreground">
              邮箱
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="input-divine"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs tracking-wider text-muted-foreground">
              密码
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              required
              minLength={6}
              className="input-divine"
            />
          </div>

          {error && (
            <p className={`text-xs ${error.includes("成功") ? "text-golden" : "text-red-400"}`}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-genesis"
          >
            {loading ? "请稍候..." : mode === "login" ? "登录" : "注册"}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="text-xs text-muted-foreground hover:text-golden transition-colors"
          >
            {mode === "login" ? "没有账号？注册" : "已有账号？登录"}
          </button>
        </div>

        {/* Decoration */}
        <div className="mt-10 h-[1px] w-full bg-gradient-to-r from-transparent via-golden/20 to-transparent" />
      </motion.div>
    </div>
  );
}
