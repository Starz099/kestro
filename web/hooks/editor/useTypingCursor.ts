import { useEffect } from "react";
import type { RefObject } from "react";

type CursorParams = {
  cursorRef: RefObject<HTMLSpanElement | null>;
  textAreaRef: RefObject<HTMLDivElement | null>;
  wordsContainerRef: RefObject<HTMLDivElement | null>;
  charRefs: RefObject<(HTMLSpanElement | null)[][]>;
  currentWordIndex: number;
  currentInput: string;
  words: string[];
};

export const useTypingCursor = ({
  cursorRef,
  textAreaRef,
  wordsContainerRef,
  charRefs,
  currentWordIndex,
  currentInput,
  words,
}: CursorParams) => {
  useEffect(() => {
    const updateCursorPosition = () => {
      if (
        cursorRef.current &&
        textAreaRef.current &&
        wordsContainerRef.current
      ) {
        let targetElement: HTMLElement | null = null;
        let useLeftEdge = false;

        if (currentWordIndex === 0 && currentInput.length === 0) {
          targetElement = charRefs.current[0]?.[0];
          useLeftEdge = true;
        } else if (currentInput.length === 0 && currentWordIndex > 0) {
          targetElement = charRefs.current[currentWordIndex]?.[0];
          useLeftEdge = true;
        } else {
          const currentWordChars = charRefs.current[currentWordIndex];
          if (currentWordChars) {
            const charIndex = Math.min(
              currentInput.length - 1,
              words[currentWordIndex].length - 1,
            );
            targetElement = currentWordChars[charIndex];
            useLeftEdge = false;
          }
        }

        if (targetElement) {
          const containerRect = textAreaRef.current.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();
          const charWidth = targetRect.width;

          let left = useLeftEdge
            ? targetRect.left - containerRect.left
            : targetRect.right - containerRect.left;

          left -= charWidth / 2;

          const top = targetRect.top - containerRect.top;

          cursorRef.current.style.left = `${left}px`;
          cursorRef.current.style.top = `${top}px`;
          cursorRef.current.style.opacity = "1";
        }
      }
    };

    requestAnimationFrame(updateCursorPosition);
  }, [
    currentWordIndex,
    currentInput,
    words,
    charRefs,
    cursorRef,
    textAreaRef,
    wordsContainerRef,
  ]);
};
