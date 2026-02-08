"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Rotate from "@/components/svgs/Rotate";
import { useEffect, useRef } from "react";
import TypingWord from "./typing-word";
import { useTypingState } from "../../hooks/editor/useTypingState";
import { useWordScroll } from "../../hooks/editor/useWordScroll";
import { useTypingCursor } from "../../hooks/editor/useTypingCursor";

const Editor = () => {
  // Placeholder text (not generated)
  const placeholderText =
    "over these at line thing order the get place like since since stand open on each time give since stand open on each time give stand open on each time give over play would people too most when late tell follow any against by will use govern through that might";
  const words = placeholderText.split(" ");

  const {
    currentWordIndex,
    currentInput,
    completedWords,
    setCurrentWordIndex,
    setCurrentInput,
    setCompletedWords,
  } = useTypingState(words);
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

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setCurrentInput("");
    setCompletedWords([]);
    wordRefs.current = [];
    charRefs.current = [];
    if (wordsContainerRef.current) {
      wordsContainerRef.current.style.transform = "translateY(0px)";
    }
    textAreaRef.current?.focus();
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
          className="flex flex-wrap gap-x-3 transition-transform duration-300 ease-out"
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
