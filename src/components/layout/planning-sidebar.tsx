"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EPOCHS } from "@/lib/constants";
import type { ProjectStage } from "@/types";
import { cn } from "@/lib/utils";

interface PlanningSidebarProps {
  projectId: string;
  currentStage: ProjectStage;
}

export function PlanningSidebar({ projectId, currentStage }: PlanningSidebarProps) {
  const pathname = usePathname();

  const stageOrder: ProjectStage[] = [
    "genesis", "theogony", "chronos", "anthropocene", "causality_1", "causality_2",
  ];
  const currentStageIndex = stageOrder.indexOf(currentStage);

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 border-r border-border bg-background overflow-y-auto">
      <div className="p-4">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          规划管线
        </p>
        <nav className="flex flex-col gap-1">
          {EPOCHS.map((epoch, index) => {
            const isAccessible = index <= currentStageIndex;
            const isCurrent = epoch.key === currentStage;
            const isActive = pathname.includes(epoch.route);
            const isCompleted = index < currentStageIndex;
            const href = `/project/${projectId}/planning/${epoch.route}`;

            return (
              <Link
                key={epoch.key}
                href={isAccessible ? href : "#"}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
                  isActive && "bg-secondary border border-border",
                  !isActive && isAccessible && "hover:bg-secondary/50",
                  !isAccessible && "cursor-not-allowed opacity-30",
                )}
                onClick={(e) => !isAccessible && e.preventDefault()}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded text-sm",
                    isCompleted && "text-golden",
                    isCurrent && "text-foreground",
                    !isAccessible && "text-muted-foreground/50",
                    isActive && !isCompleted && "text-foreground",
                  )}
                >
                  {epoch.icon}
                </span>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "font-serif text-sm",
                      isCompleted && "text-golden",
                      isCurrent && !isActive && "text-foreground/70",
                      isActive && "text-foreground",
                      !isAccessible && "text-muted-foreground/50",
                    )}
                  >
                    {epoch.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {epoch.nameEn}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-border pt-4">
          <Link
            href={`/project/${projectId}/writing`}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
              currentStage === "writing"
                ? "bg-secondary border border-border text-foreground"
                : currentStageIndex >= 4
                  ? "hover:bg-secondary/50 text-foreground/70"
                  : "cursor-not-allowed opacity-30 text-muted-foreground/50",
            )}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center text-sm">
              ✍
            </span>
            <span className="font-serif text-sm">写作空间</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
