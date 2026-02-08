import { useEffect } from "react";
import type { RefObject } from "react";

type WordScrollParams = {
  wordsContainerRef: RefObject<HTMLDivElement | null>;
  wordRefs: RefObject<(HTMLSpanElement | null)[]>;
  currentWordIndex: number;
  currentInput: string;
};

export const useWordScroll = ({
  wordsContainerRef,
  wordRefs,
  currentWordIndex,
  currentInput,
}: WordScrollParams) => {
  useEffect(() => {
    if (wordsContainerRef.current && wordRefs.current[currentWordIndex]) {
      const container = wordsContainerRef.current;
      const currentWordElement = wordRefs.current[currentWordIndex];

      if (currentWordElement) {
        const containerRect = container.getBoundingClientRect();
        const wordRect = currentWordElement.getBoundingClientRect();

        const lineHeight = 1.5 * 32;
        const relativeTop = wordRect.top - containerRect.top;
        const currentLine = Math.floor(relativeTop / lineHeight);

        if (currentLine > 1) {
          const scrollAmount = (currentLine - 1) * lineHeight;
          container.style.transform = `translateY(-${scrollAmount}px)`;
        } else {
          container.style.transform = "translateY(0px)";
        }
      }
    }
  }, [currentWordIndex, currentInput, wordRefs, wordsContainerRef]);
};
