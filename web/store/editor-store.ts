import { create } from "zustand";

import type { CompletedWord } from "@/types/editor";
import type { ResultSeriesPoint } from "@/types/results";

type EditorStore = {
  currentWordIndex: number;
  currentInput: string;
  completedWords: CompletedWord[];
  typingStartedAt: number | null;
  series: ResultSeriesPoint[];
  restartKey: number;
  setCurrentWordIndex: (index: number) => void;
  setCurrentInput: (input: string) => void;
  setCompletedWords: (words: CompletedWord[]) => void;
  setTypingStartedAt: (timestamp: number | null) => void;
  setSeries: (series: ResultSeriesPoint[]) => void;
  appendSeriesPoint: (point: ResultSeriesPoint) => void;
  resetTypingState: () => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  currentWordIndex: 0,
  currentInput: "",
  completedWords: [],
  typingStartedAt: null,
  series: [],
  restartKey: 0,
  setCurrentWordIndex: (index) => set({ currentWordIndex: index }),
  setCurrentInput: (input) => set({ currentInput: input }),
  setCompletedWords: (words) => set({ completedWords: words }),
  setTypingStartedAt: (timestamp) => set({ typingStartedAt: timestamp }),
  setSeries: (series) => set({ series }),
  appendSeriesPoint: (point) =>
    set((state) => ({ series: [...state.series, point] })),
  resetTypingState: () =>
    set((state) => ({
      currentWordIndex: 0,
      currentInput: "",
      completedWords: [],
      typingStartedAt: null,
      series: [],
      restartKey: state.restartKey + 1,
    })),
}));
