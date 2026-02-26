"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { vim } from "@replit/codemirror-vim";
import { MergeView } from "@codemirror/merge";
import { defaultKeymap } from "@codemirror/commands";

import { useEditorStore } from "@/store/editor-store";
import { useSettingsStore } from "@/store/settings-store";
import type { CompletedSnippet } from "@/types/coding";
import Rotate from "@/components/svgs/Rotate";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { breakCode } from "@/lib/code-breaker";

type VimEditorProps = {
  snippets: string[];
  isActive?: boolean;
  onTypingStart?: () => void;
  onStatsChange?: (completedSnippets: CompletedSnippet[]) => void;
  onRestart?: () => void;
};

export default function VimEditor({
  snippets,
  isActive = true,
  onTypingStart,
  onStatsChange,
  onRestart,
}: VimEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mergeViewRef = useRef<MergeView | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const { currentWordIndex, resetTypingState } = useEditorStore();
  const settings = useSettingsStore((s) => s.settings);

  // Sound playback setup
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabled = useSettingsStore((s) => s.settings.soundEnabled);

  useEffect(() => {
    if (!soundRef.current && typeof window !== "undefined") {
      soundRef.current = new Audio("/sounds/key_1.mp3");
      soundRef.current.volume = 0.1;
    }
  }, []);

  const playSound = useCallback(() => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play();
    }
  }, [soundEnabled]);

  const normalize = (str: string) =>
    str
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .trim();

  const getLanguageExtension = (lang: string): Extension => {
    switch (lang.toLowerCase()) {
      case "javascript":
      case "typescript":
        return javascript();
      default:
        return javascript();
    }
  };

  const handleUpdate = useCallback(
    (viewUpdate: any) => {
      if (viewUpdate.docChanged) {
        const state = useEditorStore.getState();
        const currentIdx = state.currentWordIndex;
        const completedS = state.completedSnippets;
        const startedAt = state.typingStartedAt;

        const value = viewUpdate.state.doc.toString();
        state.setCurrentInput(value);

        // Count keystrokes
        viewUpdate.changes.iterChanges(
          (
            fromA: number,
            toA: number,
            fromB: number,
            toB: number,
            inserted: any,
          ) => {
            const insertedLength = inserted.length;
            if (insertedLength > 0) {
              for (let i = 0; i < insertedLength; i++) {
                state.incrementKeystrokes();
              }
            } else if (toA > fromA) {
              state.incrementKeystrokes();
            }
          },
        );
        playSound();

        // Start timer on first change if it hasn't started by Shift+Enter
        if (!startedAt && value.length > 0) {
          state.setTypingStartedAt(Date.now());
          onTypingStart?.();
        }

        const targetSnippet = snippets[currentIdx] || "";

        if (normalize(value) === normalize(targetSnippet)) {
          const nextIndex = currentIdx + 1;
          const newCompleted = [
            ...completedS,
            { code: targetSnippet, isCorrect: true },
          ];

          state.setCompletedSnippets(newCompleted);
          onStatsChange?.(newCompleted);

          if (nextIndex < snippets.length) {
            state.setCurrentWordIndex(nextIndex);
          }
        }
      }
    },
    [snippets, onTypingStart, onStatsChange, playSound],
  );

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isStarted && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        setIsStarted(true);
        // Explicitly start the session
        const state = useEditorStore.getState();
        if (!state.typingStartedAt) {
          state.setTypingStartedAt(Date.now());
          onTypingStart?.();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isStarted, onTypingStart]);

  useEffect(() => {
    if (!containerRef.current || !isStarted) return;

    const currentSnippet = snippets[currentWordIndex] || "";
    const initialModifiedValue =
      settings.mode === "fix" ? breakCode(currentSnippet) : "";

    const extensions = [
      getLanguageExtension(settings.language),
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          fontSize: `${Math.min(settings.fontSize, 16)}px`,
          height: "100%",
        },
        ".cm-content": {
          fontFamily: "var(--font-roboto-mono), monospace",
        },
        ".cm-merge-view": {
          height: "100%",
        },
        "&.cm-focused": {
          outline: "none",
        },
      }),
    ];

    const mergeView = new MergeView({
      parent: containerRef.current,
      orientation: "a-b",
      highlightChanges: true,
      gutter: true,
      a: {
        doc: currentSnippet,
        extensions: [...extensions, EditorView.editable.of(false)],
      },
      b: {
        doc: initialModifiedValue,
        extensions: [
          ...extensions,
          vim(),
          keymap.of(defaultKeymap),
          EditorView.updateListener.of(handleUpdate),
          EditorState.readOnly.of(!isActive),
        ],
      },
    });

    mergeViewRef.current = mergeView;
    mergeView.b.focus();

    return () => {
      mergeView.destroy();
      mergeViewRef.current = null;
    };
  }, [
    currentWordIndex,
    snippets,
    settings.language,
    settings.mode,
    isActive,
    handleUpdate,
    isStarted,
    settings.fontSize,
  ]);

  const handleRestart = useCallback(() => {
    setIsStarted(false);
    resetTypingState();
    onRestart?.();
  }, [onRestart, resetTypingState]);

  return (
    <div
      className="flex w-full flex-col items-center gap-4"
      style={{ minWidth: "min(100vw, 900px)" }}
    >
      <div className="flex w-full items-center justify-between px-2">
        <div className="text-muted-foreground font-roboto-mono text-sm">
          Snippet {currentWordIndex + 1} / {snippets.length}
        </div>
        <div className="text-muted-foreground font-roboto-mono text-sm uppercase">
          {settings.language} (VIM)
        </div>
      </div>
      <div className="border-border relative h-[450px] w-full min-w-xs overflow-hidden rounded-md border bg-[#282c34] shadow-lg">
        {!isStarted ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#282c34] text-white">
            <p className="text-xl font-medium opacity-80">Vim Mode</p>
            <div className="flex items-center gap-2 rounded bg-black/30 px-4 py-2 text-sm text-gray-400">
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-white">
                Shift
              </kbd>
              <span>+</span>
              <kbd className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-white">
                Enter
              </kbd>
              <span className="ml-2">to start typing</span>
            </div>
          </div>
        ) : (
          <div ref={containerRef} className="h-full w-full" />
        )}
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
