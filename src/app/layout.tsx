import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/layout/auth-provider";

export const metadata: Metadata = {
  title: "纪元 — AI 协作长篇小说创作系统",
  description: "人筑骨，机填肉。六大纪元递进式长篇小说逻辑架构与创作引擎。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
