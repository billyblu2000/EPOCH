import { create } from "zustand";
import type { GenesisForm } from "@/types";

type GenesisPhase = "form" | "generating" | "artifact";

interface GenesisState {
  phase: GenesisPhase;
  formData: GenesisForm | null;
  artifactText: string;
  isGenerating: boolean;
  streamBuffer: string;

  setPhase: (phase: GenesisPhase) => void;
  setFormData: (data: GenesisForm) => void;
  setArtifactText: (text: string) => void;
  setGenerating: (v: boolean) => void;
  appendStream: (chunk: string) => void;
  resetStream: () => void;
  resetAll: () => void;
}

export const useGenesisStore = create<GenesisState>((set) => ({
  phase: "form",
  formData: null,
  artifactText: "",
  isGenerating: false,
  streamBuffer: "",

  setPhase: (phase) => set({ phase }),
  setFormData: (formData) => set({ formData }),
  setArtifactText: (artifactText) => set({ artifactText }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  appendStream: (chunk) =>
    set((s) => ({ streamBuffer: s.streamBuffer + chunk })),
  resetStream: () =>
    set({ streamBuffer: "", isGenerating: false }),
  resetAll: () =>
    set({
      phase: "form",
      formData: null,
      artifactText: "",
      isGenerating: false,
      streamBuffer: "",
    }),
}));
