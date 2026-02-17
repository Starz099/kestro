"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Rotate from "@/components/svgs/Rotate";
import { useCallback, useEffect, useMemo, useRef } from "react";
import TypingWord from "./typing-word";
import { useTypingState } from "../../hooks/editor/useTypingState";
import { useTypingSeries } from "../../hooks/editor/useTypingSeries";
import { useWordScroll } from "../../hooks/editor/useWordScroll";
import { useTypingCursor } from "../../hooks/editor/useTypingCursor";
import type { CompletedWord } from "@/types/editor";
import { useEditorStore } from "@/store/editor-store";
import { useSettingsStore } from "@/store/settings-store";
import { generateCodeSnippets } from "@/lib/code-generator";
import { useTypingCode } from "@/hooks/editor/useTypingCode";
import { useCodeSeries } from "@/hooks/editor/useCodeSeries";

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
  // Settings
  const language = useSettingsStore((s) => s.settings.language);
  const mode = useSettingsStore((s) => s.settings.mode);
  const snippetCount = useSettingsStore((s) => s.settings.snippetCount);

  // Detect if we're in code mode
  const isCodeMode = language === "javascript" && mode === "snippets";

  // Always call hooks at the top level
  const snippets = useMemo(
    () => (isCodeMode ? generateCodeSnippets(snippetCount || 5) : []),
    [isCodeMode, snippetCount],
  );
  const codeTyping = useTypingCode(snippets);
  useCodeSeries(snippets, { enabled: isCodeMode });

  // Word mode hooks
  const restartKey = useEditorStore((state) => state.restartKey);
  const resetTypingState = useEditorStore((state) => state.resetTypingState);
  const { currentWordIndex, currentInput, completedWords } = useTypingState(
    words,
    {
      enabled: isActive && !isCodeMode,
      onTypingStart,
      resetKey: restartKey,
    },
  );

  const textAreaRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useWordScroll({
    wordsContainerRef,
    wordRefs,
    currentWordIndex,
    currentInput,
  });

  useTypingSeries(words, { enabled: isActive && !isCodeMode });

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
    if (!isCodeMode) {
      onStatsChange?.(completedWords);
    }
  }, [completedWords, onStatsChange, isCodeMode]);

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

  // --- CODE MODE RENDER ---
  if (isCodeMode) {
    const { currentSnippetIndex, currentInput, completedSnippets } = codeTyping;
    return (
      <div>
        <div>
          {snippets.map((snippet, idx) => (
            <pre
              key={idx}
              style={{
                background:
                  idx === currentSnippetIndex ? "#f0f0f0" : "transparent",
                fontWeight: idx === currentSnippetIndex ? "bold" : "normal",
                padding: 8,
                marginBottom: 4,
              }}
            >
              {snippet}
            </pre>
          ))}
        </div>
        <textarea
          value={currentInput}
          onChange={() => {}} // Input handling is managed by the hook/store
          placeholder="Type the code here..."
          style={{ width: "100%", minHeight: 80, marginTop: 12 }}
        />
        <div style={{ marginTop: 12 }}>
          Completed: {completedSnippets.length} / {snippets.length}
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
  }

  // --- WORD MODE RENDER ---
  return (
    <div className="mt-18 flex w-full flex-col items-center justify-center gap-8">
      <div
        ref={textAreaRef}
        tabIndex={0}
        className="font-roboto-mono relative overflow-hidden text-[32px] leading-normal font-medium focus:outline-none"
        style={{
          height: "calc(1.5em * 3)",
          maxHeight: "calc(1.5em * 3)",
        }}
      >
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
