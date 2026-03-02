"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { useProjectStore } from "@/stores/project-store";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.id as string;
  const { currentProject, projects, setCurrentProject } = useProjectStore();

  useEffect(() => {
    if (!currentProject || currentProject.id !== projectId) {
      const found = projects.find((p) => p.id === projectId);
      if (found) {
        setCurrentProject(found);
      } else {
        setCurrentProject({
          id: projectId,
          user_id: "mock-user",
          title: "未命名项目",
          description: null,
          stage: "genesis",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
  }, [projectId]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">{children}</main>
    </div>
  );
}
