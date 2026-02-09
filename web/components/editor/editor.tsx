"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Rotate from "@/components/svgs/Rotate";
import { useCallback, useEffect, useRef } from "react";
import TypingWord from "./typing-word";
import { useTypingState } from "../../hooks/editor/useTypingState";
import { useWordScroll } from "../../hooks/editor/useWordScroll";
import { useTypingCursor } from "../../hooks/editor/useTypingCursor";
import type { CompletedWord } from "@/types/editor";
import { useEditorStore } from "@/store/editor-store";

type EditorProps = {
  words: string[];
  isActive?: boolean;
  onTypingStart?: () => void;
  onStatsChange?: (completedWords: CompletedWord[]) => void;
  onRestart?: () => void;
};

const Editor = ({
  words,
  isActive = true,
  onTypingStart,
  onStatsChange,
  onRestart,
}: EditorProps) => {
  const restartKey = useEditorStore((state) => state.restartKey);
  const resetTypingState = useEditorStore((state) => state.resetTypingState);
  const { currentWordIndex, currentInput, completedWords } = useTypingState(
    words,
    {
      enabled: isActive,
      onTypingStart,
      resetKey: restartKey,
    },
  );
  const textAreaRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([]);

  // Focus on mount
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useWordScroll({
    wordsContainerRef,
    wordRefs,
    currentWordIndex,
    currentInput,
  });

  useTypingCursor({
    cursorRef,
    textAreaRef,
    wordsContainerRef,
    charRefs,
    currentWordIndex,
    currentInput,
    words,
  });

  useEffect(() => {
    onStatsChange?.(completedWords);
  }, [completedWords, onStatsChange]);

  const resetEditorState = useCallback(() => {
    resetTypingState();
    wordRefs.current = [];
    charRefs.current = [];
    if (wordsContainerRef.current) {
      wordsContainerRef.current.style.transform = "translateY(0px)";
    }
    textAreaRef.current?.focus();
  }, [resetTypingState]);

  useEffect(() => {
    resetEditorState();
  }, [resetEditorState, words]);

  const handleRestart = () => {
    resetEditorState();
    onRestart?.();
  };

  return (
    <div className="mt-18 flex w-full flex-col items-center justify-center gap-8">
      <div
        ref={textAreaRef}
        tabIndex={0}
        className="font-roboto-mono relative overflow-hidden text-[32px] leading-normal font-medium focus:outline-none"
        style={{
          height: "calc(1.5em * 3)", // Fixed height for 3 lines
          maxHeight: "calc(1.5em * 3)",
        }}
      >
        {/* Absolute positioned cursor */}
        <span
          ref={cursorRef}
          className="text-foreground font-roboto-mono pointer-events-none absolute animate-pulse font-medium"
          style={{
            opacity: 0,
            fontSize: "32px",
            lineHeight: "1.5",
          }}
        >
          |
        </span>

        <div
          ref={wordsContainerRef}
          className="transition-transform duration-300 ease-out"
          style={{
            textAlign: "justify",
            textAlignLast: "center",
          }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
            >
              <TypingWord
                word={word}
                index={index}
                currentWordIndex={currentWordIndex}
                currentInput={currentInput}
                completedWords={completedWords}
                charRefs={charRefs}
              />
              {index < words.length - 1 && (
                <span className="text-muted-foreground"> </span>
              )}
            </span>
          ))}
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger onClick={handleRestart}>
          <Rotate className="cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="bg-muted text-muted-foreground rounded-sm">
          <p>Restart</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Editor;
