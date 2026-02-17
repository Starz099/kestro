import { useEffect, useRef } from "react";

import { useEditorStore } from "@/store/editor-store";
import type { ResultSeriesPoint } from "@/types/results";

type CodeSeriesOptions = {
  enabled?: boolean;
};

export const useCodeSeries = (
  snippets: string[],
  { enabled = true }: CodeSeriesOptions = {},
) => {
  const typingStartedAt = useEditorStore((state) => state.typingStartedAt);
  const appendSeriesPoint = useEditorStore((state) => state.appendSeriesPoint);
  const lastSecondRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !typingStartedAt) {
      lastSecondRef.current = null;
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - typingStartedAt) / 1000);

      if (elapsedSeconds <= 0 || lastSecondRef.current === elapsedSeconds) {
        return;
      }

      const state = useEditorStore.getState();
      const completedSnippets = state.completedSnippets;
      const currentSnippetIndex = state.currentWordIndex;
      const currentInput = state.currentInput;

      const completedCharacters = snippets
        .slice(0, currentSnippetIndex)
        .reduce((sum, snippet) => sum + snippet.length, 0);
      const totalCharacters = completedCharacters + currentInput.length;
      const errorCount = completedSnippets.filter((s) => !s.isCorrect).length;

      const wpm = totalCharacters / 5 / elapsedSeconds || 0;
      const rawWpm = wpm;
      const errors = errorCount;

      const point: ResultSeriesPoint = {
        second: elapsedSeconds,
        wpm,
        rawWpm,
        errors,
      };

      lastSecondRef.current = elapsedSeconds;
      appendSeriesPoint(point);
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [appendSeriesPoint, enabled, typingStartedAt, snippets]);
};
