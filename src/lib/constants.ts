import { EpochInfo, ProjectStage } from "@/types";

export const EPOCHS: EpochInfo[] = [
  {
    key: "genesis",
    name: "创世纪",
    nameEn: "Genesis",
    icon: "✦",
    artifact: "《创世书》",
    completionText: "创世已成，万物有法",
    route: "genesis",
  },
  {
    key: "theogony",
    name: "神世纪",
    nameEn: "Theogony",
    icon: "◈",
    artifact: "《神世法》",
    completionText: "诸法已定，世界成形",
    route: "theogony",
  },
  {
    key: "chronos",
    name: "时空纪",
    nameEn: "Chronos",
    icon: "◉",
    artifact: "《时空律》",
    completionText: "时空已编，因果可循",
    route: "chronos",
  },
  {
    key: "anthropocene",
    name: "人世纪",
    nameEn: "Anthropocene",
    icon: "◎",
    artifact: "《众生相》",
    completionText: "众生已塑，命运待书",
    route: "anthropocene",
  },
  {
    key: "causality_1",
    name: "因果一纪",
    nameEn: "Causality I",
    icon: "⟐",
    artifact: "《因果录》",
    completionText: "因果已录，篇章待启",
    route: "causality-1",
  },
  {
    key: "causality_2",
    name: "因果二纪",
    nameEn: "Causality II",
    icon: "▣",
    artifact: "《命理镜》",
    completionText: "分镜已成，执笔可书",
    route: "causality-2",
  },
];

export const STAGE_ORDER: ProjectStage[] = [
  "genesis",
  "theogony",
  "chronos",
  "anthropocene",
  "causality_1",
  "causality_2",
  "writing",
];

export function getEpochByStage(stage: ProjectStage): EpochInfo | undefined {
  return EPOCHS.find((e) => e.key === stage);
}

export function getStageIndex(stage: ProjectStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function isStageCompleted(
  currentStage: ProjectStage,
  checkStage: ProjectStage
): boolean {
  return getStageIndex(currentStage) > getStageIndex(checkStage);
}

export function isStageAccessible(
  currentStage: ProjectStage,
  checkStage: ProjectStage
): boolean {
  return getStageIndex(currentStage) >= getStageIndex(checkStage);
}
