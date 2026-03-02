"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Key, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { AI_PROVIDERS } from "@/lib/ai/model-config";
import { getAIKeys, setAIKeys, type AIKeyConfig } from "@/lib/ai-keys";

export default function SettingsPage() {
  const router = useRouter();
  const [keys, setKeysState] = useState<AIKeyConfig>({});
  const [saved, setSaved] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setKeysState(getAIKeys());
  }, []);

  const handleSave = () => {
    setAIKeys(keys);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleVisible = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <Container narrow className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </button>

            {/* Title */}
            <div className="mb-10">
              <h1 className="text-xl font-medium text-foreground">设置</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                配置 AI 服务商 API Key。密钥仅存储在您的浏览器本地，不会上传到服务器。
              </p>
            </div>

            {/* API Keys */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-4 w-4 text-golden" />
                <h2 className="text-sm font-medium tracking-wider text-foreground">
                  AI 服务商
                </h2>
              </div>

              {AI_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="rounded-lg border border-border/60 bg-card p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        {provider.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {provider.description}
                      </p>
                    </div>
                    {keys[provider.id as keyof AIKeyConfig] && (
                      <span className="text-[10px] text-golden/70 bg-golden/10 px-2 py-0.5 rounded">
                        已配置
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={visibleKeys[provider.id] ? "text" : "password"}
                        value={
                          visibleKeys[provider.id]
                            ? keys[provider.id as keyof AIKeyConfig] || ""
                            : keys[provider.id as keyof AIKeyConfig]
                              ? maskKey(keys[provider.id as keyof AIKeyConfig]!)
                              : ""
                        }
                        onChange={(e) =>
                          setKeysState((prev) => ({
                            ...prev,
                            [provider.id]: e.target.value,
                          }))
                        }
                        onFocus={() =>
                          setVisibleKeys((prev) => ({
                            ...prev,
                            [provider.id]: true,
                          }))
                        }
                        placeholder={`输入 ${provider.name} API Key`}
                        className="input-divine pr-10 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisible(provider.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {visibleKeys[provider.id] ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground/60">
                    Base URL: {provider.baseURL}
                  </p>
                </div>
              ))}

              <div className="flex items-center gap-3 pt-4">
                <Button onClick={handleSave} className="btn-genesis">
                  {saved ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="h-4 w-4" />
                      已保存
                    </span>
                  ) : (
                    "保存配置"
                  )}
                </Button>
                <p className="text-[10px] text-muted-foreground/50">
                  密钥存储在浏览器 localStorage 中
                </p>
              </div>
            </div>

            {/* Model Info */}
            <div className="mt-12 rounded-lg border border-border/40 bg-card/50 p-5">
              <h2 className="text-sm font-medium text-foreground mb-3">
                模型分配
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                系统为每个纪元步骤自动选择最合适的模型，无需手动配置。
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                  ["创世纪", "MiniMax-M2.5"],
                  ["神世纪", "MiniMax-M2.5"],
                  ["时空纪", "MiniMax-M2.5"],
                  ["人世纪", "MiniMax-M2.5"],
                  ["因果一纪", "MiniMax-M2.5"],
                  ["因果二纪", "MiniMax-M2.5"],
                  ["续写", "MiniMax-M2.5"],
                ].map(([step, model]) => (
                  <div
                    key={step}
                    className="flex items-center justify-between py-1.5 px-3 rounded bg-background/50"
                  >
                    <span className="text-muted-foreground">{step}</span>
                    <span className="font-mono text-foreground/70">{model}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  );
}
