"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Rotate from "@/components/svgs/Rotate";
import { useCallback, useEffect, useRef } from "react";
import TypingWord from "./typing-word";
import { useTypingState } from "../../hooks/editor/useTypingState";
import { useTypingSeries } from "../../hooks/editor/useTypingSeries";
import { useWordScroll } from "../../hooks/editor/useWordScroll";
import { useTypingCursor } from "../../hooks/editor/useTypingCursor";
import { useEditorStore } from "@/store/editor-store";
import { useSettingsStore } from "@/store/settings-store";

import CodeEditor from "./code-editor";

type EditorProps = {
  words: string[];
  isActive?: boolean;
  onTypingStart?: () => void;
  onStatsChange?: (completedItems: any[]) => void;
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
  const editorMode = useSettingsStore((s) => s.settings.editorMode);
  const fontSize = useSettingsStore((s) => s.settings.fontSize);

  // Detect if we're in code mode
  const isCodeMode = editorMode === "vscode";

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
    if (!isCodeMode) {
      textAreaRef.current?.focus();
    }
  }, [isCodeMode]);

  useWordScroll({
    wordsContainerRef,
    wordRefs,
    currentWordIndex,
    currentInput,
  });

  useTypingSeries(words, { enabled: isActive, isCodeMode });

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
    if (!isCodeMode) {
      textAreaRef.current?.focus();
    }
  }, [resetTypingState, isCodeMode]);

  useEffect(() => {
    resetEditorState();
  }, [resetEditorState, words]);

  const handleRestart = () => {
    resetEditorState();
    onRestart?.();
  };

  // --- CODE MODE RENDER ---
  if (isCodeMode) {
    const settings = useSettingsStore.getState().settings;
    return (
      <CodeEditor
        key={`${restartKey}-${settings.language}`}
        snippets={words}
        isActive={isActive}
        onTypingStart={onTypingStart}
        onStatsChange={onStatsChange}
        onRestart={onRestart}
      />
    );
  }

  // --- WORD MODE RENDER ---
  return (
    <div className="mt-18 flex w-full flex-col items-center justify-center gap-8">
      <div
        ref={textAreaRef}
        tabIndex={0}
        className="font-roboto-mono relative overflow-hidden leading-normal font-medium focus:outline-none"
        style={{
          fontSize: `${fontSize}px`,
          height: `calc(${fontSize}px * 1.5 * 3)`,
          maxHeight: `calc(${fontSize}px * 1.5 * 3)`,
        }}
      >
        <span
          ref={cursorRef}
          className="text-foreground font-roboto-mono pointer-events-none absolute animate-pulse font-medium"
          style={{
            opacity: 0,
            fontSize: `${fontSize}px`,
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
