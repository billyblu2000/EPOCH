import { create } from "zustand";

interface EpochState {
  isGenerating: boolean;
  generatedText: string;
  streamBuffer: string;

  setGenerating: (isGenerating: boolean) => void;
  setGeneratedText: (text: string) => void;
  appendStreamBuffer: (chunk: string) => void;
  resetStream: () => void;
}

export const useEpochStore = create<EpochState>((set) => ({
  isGenerating: false,
  generatedText: "",
  streamBuffer: "",

  setGenerating: (isGenerating) => set({ isGenerating }),

  setGeneratedText: (generatedText) => set({ generatedText }),

  appendStreamBuffer: (chunk) =>
    set((state) => ({ streamBuffer: state.streamBuffer + chunk })),

  resetStream: () => set({ streamBuffer: "", generatedText: "", isGenerating: false }),
}));
