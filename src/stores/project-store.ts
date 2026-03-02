import { create } from "zustand";
import type { Project, ProjectStage } from "@/types";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;

  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
  updateProjectStage: (projectId: string, stage: ProjectStage) => void;
  addProject: (project: Project) => void;
  removeProject: (projectId: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  setProjects: (projects) => set({ projects }),

  setCurrentProject: (project) => set({ currentProject: project }),

  setLoading: (isLoading) => set({ isLoading }),

  updateProjectStage: (projectId, stage) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, stage } : p
      ),
      currentProject:
        state.currentProject?.id === projectId
          ? { ...state.currentProject, stage }
          : state.currentProject,
    })),

  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),

  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      currentProject:
        state.currentProject?.id === projectId
          ? null
          : state.currentProject,
    })),
}));
