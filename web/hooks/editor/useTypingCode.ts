import { useEffect, useRef } from "react";
import type { CompletedSnippet } from "@/types/coding";
import { useEditorStore } from "@/store/editor-store";

type TypingCodeOptions = {
  enabled?: boolean;
  onTypingStart?: () => void;
  resetKey?: number;
};

type TypingCodeState = {
  currentSnippetIndex: number;
  currentInput: string;
  completedSnippets: CompletedSnippet[];
};

export const useTypingCode = (
  snippets: string[],
  { enabled = true, onTypingStart, resetKey }: TypingCodeOptions = {},
): TypingCodeState => {
  const currentSnippetIndex = useEditorStore((state) => state.currentWordIndex);
  const currentInput = useEditorStore((state) => state.currentInput);
  const completedSnippets = useEditorStore((state) => state.completedSnippets);
  const setCurrentSnippetIndex = useEditorStore(
    (state) => state.setCurrentWordIndex,
  );
  const setCurrentInput = useEditorStore((state) => state.setCurrentInput);
  const setCompletedSnippets = useEditorStore(
    (state) => state.setCompletedSnippets,
  );
  const typingStartedAt = useEditorStore((state) => state.typingStartedAt);
  const setTypingStartedAt = useEditorStore(
    (state) => state.setTypingStartedAt,
  );
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger onTypingStart on first character
      if (
        !hasStartedRef.current &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        hasStartedRef.current = true;
        if (!typingStartedAt) {
          setTypingStartedAt(Date.now());
        }
        onTypingStart?.();
      }

      // Stop if all snippets completed
      if (currentSnippetIndex >= snippets.length) {
        return;
      }

      const currentSnippet = snippets[currentSnippetIndex];

      if (e.key === "Backspace") {
        e.preventDefault();
        setCurrentInput(currentInput.slice(0, -1));
      } else if (e.key.length === 1) {
        e.preventDefault();
        const nextInput = currentInput + e.key;

        // Check if snippet is complete (user typed full length)
        if (nextInput.length === currentSnippet.length) {
          const isCorrect = nextInput === currentSnippet;
          setCompletedSnippets([
            ...completedSnippets,
            { code: nextInput, isCorrect },
          ]);
          setCurrentInput("");
          setCurrentSnippetIndex(currentSnippetIndex + 1);
        } else {
          // Still typing, update input
          setCurrentInput(nextInput);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    enabled,
    currentSnippetIndex,
    currentInput,
    snippets,
    setCurrentSnippetIndex,
    setCurrentInput,
    setCompletedSnippets,
    completedSnippets,
    typingStartedAt,
    setTypingStartedAt,
    onTypingStart,
  ]);

  useEffect(() => {
    if (resetKey !== undefined) {
      hasStartedRef.current = false;
    }
  }, [resetKey]);

  return {
    currentSnippetIndex,
    currentInput,
    completedSnippets,
  };
};
