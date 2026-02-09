import { useEffect, useRef } from "react";
import type { CompletedWord } from "../../types/editor";
import { useEditorStore } from "@/store/editor-store";

type TypingOptions = {
  enabled?: boolean;
  onTypingStart?: () => void;
  resetKey?: number;
};

type TypingState = {
  currentWordIndex: number;
  currentInput: string;
  completedWords: CompletedWord[];
  setCurrentWordIndex: (index: number) => void;
  setCurrentInput: (input: string) => void;
  setCompletedWords: (words: CompletedWord[]) => void;
};

export const useTypingState = (
  words: string[],
  { enabled = true, onTypingStart, resetKey }: TypingOptions = {},
): TypingState => {
  const currentWordIndex = useEditorStore((state) => state.currentWordIndex);
  const currentInput = useEditorStore((state) => state.currentInput);
  const completedWords = useEditorStore((state) => state.completedWords);
  const setCurrentWordIndex = useEditorStore(
    (state) => state.setCurrentWordIndex,
  );
  const setCurrentInput = useEditorStore((state) => state.setCurrentInput);
  const setCompletedWords = useEditorStore((state) => state.setCompletedWords);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !hasStartedRef.current &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        hasStartedRef.current = true;
        onTypingStart?.();
      }

      if (e.key === " ") {
        e.preventDefault();
        if (currentInput.trim().length > 0) {
          const isCorrect = currentInput.trim() === words[currentWordIndex];
          setCompletedWords([
            ...completedWords,
            { word: currentInput.trim(), isCorrect },
          ]);
          setCurrentWordIndex(currentWordIndex + 1);
          setCurrentInput("");
        }
      } else if (e.key === "Backspace") {
        e.preventDefault();
        if (currentInput.length > 0) {
          setCurrentInput(currentInput.slice(0, -1));
        } else if (completedWords.length > 0) {
          const lastWordObj = completedWords[completedWords.length - 1];
          setCompletedWords(completedWords.slice(0, -1));
          setCurrentWordIndex(currentWordIndex - 1);
          setCurrentInput(lastWordObj.word);
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setCurrentInput(currentInput + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentInput,
    currentWordIndex,
    completedWords,
    setCompletedWords,
    setCurrentInput,
    setCurrentWordIndex,
    enabled,
    onTypingStart,
    words,
  ]);

  useEffect(() => {
    if (!enabled) {
      hasStartedRef.current = false;
    }
  }, [enabled, words]);

  useEffect(() => {
    if (resetKey !== undefined) {
      hasStartedRef.current = false;
    }
  }, [resetKey]);

  return {
    currentWordIndex,
    currentInput,
    completedWords,
    setCurrentWordIndex,
    setCurrentInput,
    setCompletedWords,
  };
};
