import { useEffect, useRef } from "react";

import { useEditorStore } from "@/store/editor-store";
import {
  calculateCharacterBreakdown,
  calculateErrors,
  calculatePartialBreakdown,
  calculateRawWpm,
  calculateWpm,
} from "@/lib/results-metrics";
import type { ResultSeriesPoint } from "@/types/results";

type TypingSeriesOptions = {
  enabled?: boolean;
};

export const useTypingSeries = (
  words: string[],
  { enabled = true }: TypingSeriesOptions = {},
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
      const completedWords = state.completedWords;
      const currentWordIndex = state.currentWordIndex;
      const currentInput = state.currentInput;

      const completedBreakdown = calculateCharacterBreakdown(
        completedWords,
        words,
      );
      const partial = calculatePartialBreakdown(
        currentInput,
        words[currentWordIndex] ?? "",
      );
      const combined = {
        correct: completedBreakdown.correct + partial.correct,
        incorrect: completedBreakdown.incorrect + partial.incorrect,
        extra: completedBreakdown.extra + partial.extra,
        missed: completedBreakdown.missed,
      };
      const wpm = calculateWpm(combined.correct, elapsedSeconds);
      const rawWpm = calculateRawWpm(combined, elapsedSeconds);
      const errors = calculateErrors(combined);

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
  }, [appendSeriesPoint, enabled, typingStartedAt, words]);
};
