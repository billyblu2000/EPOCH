"use client";

import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import { useProjectStore } from "@/stores/project-store";
import { useEffect } from "react";
import type { Project } from "@/types";

const MOCK_PROJECTS: Project[] = [
  {
    id: "demo-project-1",
    user_id: "mock-user",
    title: "玄霄录",
    description: "一部关于命运与意志对抗的仙侠长篇",
    stage: "genesis",
    created_at: "2026-03-01T12:00:00Z",
    updated_at: "2026-03-01T12:00:00Z",
  },
];

export default function DashboardPage() {
  const { projects, setProjects, setCurrentProject } = useProjectStore();

  useEffect(() => {
    if (projects.length === 0) {
      setProjects(MOCK_PROJECTS);
    }
  }, []);

  const displayProjects = projects.length > 0 ? projects : MOCK_PROJECTS;

  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
  };

  return (
    <Container className="py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-medium text-foreground">我的作品</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理你的长篇小说项目</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          新建项目
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayProjects.map((project) => {
          const stageLabels: Record<string, string> = {
            genesis: "创世纪",
            theogony: "神世纪",
            chronos: "时空纪",
            anthropocene: "人世纪",
            causality_1: "因果一纪",
            causality_2: "因果二纪",
            writing: "写作中",
          };
          return (
            <Link
              key={project.id}
              href={`/project/${project.id}/planning/genesis`}
              onClick={() => handleProjectClick(project)}
              className="group rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-golden/40 glow-golden-hover"
            >
              <div className="flex items-start justify-between">
                <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-golden transition-colors" strokeWidth={1.5} />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {stageLabels[project.stage] || project.stage}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-lg text-foreground">
                {project.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground/70">
                <span>更新于 {new Date(project.updated_at).toLocaleDateString("zh-CN")}</span>
              </div>
            </Link>
          );
        })}

        <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-muted-foreground transition-all duration-200 hover:border-golden/40 hover:text-golden min-h-[180px]">
          <Plus className="h-8 w-8 mb-2" strokeWidth={1} />
          <span className="text-sm">创建新作品</span>
        </button>
      </div>
    </Container>
  );
}
