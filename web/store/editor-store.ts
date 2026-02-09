import { create } from "zustand";

import type { CompletedWord } from "@/types/editor";

type EditorStore = {
  currentWordIndex: number;
  currentInput: string;
  completedWords: CompletedWord[];
  restartKey: number;
  setCurrentWordIndex: (index: number) => void;
  setCurrentInput: (input: string) => void;
  setCompletedWords: (words: CompletedWord[]) => void;
  resetTypingState: () => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  currentWordIndex: 0,
  currentInput: "",
  completedWords: [],
  restartKey: 0,
  setCurrentWordIndex: (index) => set({ currentWordIndex: index }),
  setCurrentInput: (input) => set({ currentInput: input }),
  setCompletedWords: (words) => set({ completedWords: words }),
  resetTypingState: () =>
    set((state) => ({
      currentWordIndex: 0,
      currentInput: "",
      completedWords: [],
      restartKey: state.restartKey + 1,
    })),
}));
