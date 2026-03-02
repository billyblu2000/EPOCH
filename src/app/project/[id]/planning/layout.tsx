"use client";

import { PlanningSidebar } from "@/components/layout/planning-sidebar";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";

export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.id as string;
  const currentProject = useProjectStore((s) => s.currentProject);
  const currentStage = currentProject?.stage ?? "genesis";

  return (
    <div className="flex">
      <PlanningSidebar projectId={projectId} currentStage={currentStage} />
      <div className="ml-56 flex-1 min-h-[calc(100vh-3.5rem)]">
        {children}
      </div>
    </div>
  );
}
