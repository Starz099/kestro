"use client";
import { DiffEditor, loader } from "@monaco-editor/react";

import { useCallback, useRef, useState, useEffect } from "react";
import { useEditorStore } from "@/store/editor-store";
import { useSettingsStore } from "@/store/settings-store";
import type { CompletedSnippet } from "@/types/coding";
import Rotate from "@/components/svgs/Rotate";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { breakCode } from "@/lib/code-breaker";

type CodeEditorProps = {
  snippets: string[];
  isActive?: boolean;
  onTypingStart?: () => void;
  onStatsChange?: (completedSnippets: CompletedSnippet[]) => void;
  onRestart?: () => void;
};

const CodeEditor = ({
  snippets,
  isActive = true,
  onTypingStart,
  onStatsChange,
  onRestart,
}: CodeEditorProps) => {
  // Load Dracula theme JSON using require for compatibility
  useEffect(() => {
    async function loadTheme() {
      const draculaTheme = await import("./themes/Dracula.json");
      loader.init().then((monaco) => {
        monaco.editor.defineTheme(
          "dracula",
          (draculaTheme.default || draculaTheme) as any,
        );
      });
    }
    loadTheme();
  }, []);
  const { currentWordIndex, resetTypingState } = useEditorStore();

  const settings = useSettingsStore((s) => s.settings);
  const [modifiedValue, setModifiedValue] = useState("");
  const editorRef = useRef<any>(null);

  const currentSnippet = snippets[currentWordIndex] || "";

  // Initialize modified value based on mode
  useEffect(() => {
    const fn = async (x: string) => {
      setModifiedValue(x);
    };
    if (settings.mode === "fix" && currentSnippet) {
      fn(breakCode(currentSnippet));
    } else {
      fn("");
    }
  }, [currentWordIndex, currentSnippet, settings.mode]);

  // Sound playback setup
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabled = useSettingsStore((s) => s.settings.soundEnabled);
  // Initialize sound asset in effect
  useEffect(() => {
    if (!soundRef.current && typeof window !== "undefined") {
      soundRef.current = new Audio("/sounds/key_1.mp3");
      soundRef.current.volume = 0.1;
    }
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    const modifiedEditor = editor.getModifiedEditor();

    // Configure Monaco to use tabs for better matching with snippet bank
    const model = modifiedEditor.getModel();
    if (model) {
      model.updateOptions({ insertSpaces: false, tabSize: 2 });
    }

    modifiedEditor.onDidChangeModelContent((e: any) => {
      // Access store state inside the listener to get LATEST values
      const state = useEditorStore.getState();
      const currentIdx = state.currentWordIndex;
      const completedS = state.completedSnippets;
      const startedAt = state.typingStartedAt;

      const value = modifiedEditor.getValue();
      setModifiedValue(value);
      state.setCurrentInput(value);

      // Increment keystrokes based on the change event
      e.changes.forEach((change: any) => {
        if (change.text.length > 0) {
          for (let i = 0; i < change.text.length; i++) {
            state.incrementKeystrokes();
          }
        } else if (change.rangeLength > 0) {
          // Play sound if enabled
          if (soundEnabled && soundRef.current) {
            soundRef.current.currentTime = 0;
            soundRef.current.play();
          }
          state.incrementKeystrokes();
        }
      });
      // Play sound if enabled
      if (soundEnabled && soundRef.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play();
      }

      // Start timer on first change
      if (!startedAt && value.length > 0) {
        state.setTypingStartedAt(Date.now());
        onTypingStart?.();
      }

      const targetSnippet = snippets[currentIdx] || "";

      // NORMALIZE AND COMPARE:
      // 1. Uniform line endings
      // 2. Uniform indentation (convert tabs to spaces for comparison if needed, or vice-versa)
      // 3. Trim trailing whitespace on each line
      const normalize = (str: string) =>
        str
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n")
          .split("\n")
          .map((line) => line.trimEnd())
          .join("\n")
          .trim();

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
          const nextSnippet = snippets[nextIndex];
          const newValue =
            useSettingsStore.getState().settings.mode === "fix"
              ? breakCode(nextSnippet)
              : "";
          setModifiedValue(newValue);
          modifiedEditor.setValue(newValue);
        }
      }
    });
  };

  const handleRestart = useCallback(() => {
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
          {settings.language}
        </div>
      </div>
      <div className="border-border relative flex h-[450px] w-full min-w-xs justify-center overflow-hidden rounded-md border shadow-lg">
        <div className="relative h-full w-[60vw]">
          <DiffEditor
            width="100%"
            height="100%"
            original={currentSnippet}
            modified={modifiedValue}
            language={settings.language.toLowerCase()}
            theme="dracula"
            onMount={handleEditorDidMount}
            options={{
              fontSize: Math.min(settings.fontSize, 16),
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              readOnly: !isActive,
              renderSideBySide: true,
              originalEditable: false,
              lineNumbers: "off",
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              ignoreTrimWhitespace: false,
              renderWhitespace: "all",
              diffWordWrap: "on",
              enableSplitViewResizing: false,
              renderIndicators: false,
            }}
          />
          {/* Overlay to block diff arrows and sash interaction */}
          <div
            className="absolute top-0 bottom-0 left-1/2 z-10 w-8 -translate-x-13 bg-transparent"
            style={{ pointerEvents: "auto" }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
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

export default CodeEditor;
