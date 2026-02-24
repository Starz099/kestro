"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Editor from "@/components/editor/editor";
import Footer from "@/components/footer";
import SettingsPanel from "@/components/settings-panel";
import Navbar from "@/components/navbar";
import { generateWordSequence } from "@/lib/word-generator";
import { generateSnippets } from "@/lib/code_generator";
import { getActivityType, type FilterPreferences } from "@/lib/filter-options";
import type { CompletedItem } from "@/types/editor";
import { useSettingsStore } from "@/store/settings-store";
import { useEditorStore } from "@/store/editor-store";
import ResultsPanel from "@/components/results/results-panel";
import { calculateResultsMetrics } from "@/lib/results-metrics";
import Tracker from "@/components/Tracker";

const WORD_SEQUENCE_LENGTH = 700;
const CODE_SEQUENCE_LENGTH = 40;

const getSequenceLength = (settings: FilterPreferences) => {
  const activity = getActivityType(settings.language);

  if (settings.mode === "timer" || settings.mode === "fix") {
    return activity === "CODE" ? CODE_SEQUENCE_LENGTH : WORD_SEQUENCE_LENGTH;
  }

  if (activity === "CODE") {
    return settings.snippetCount || 5;
  }

  if (settings.mode === "words") {
    return settings.wordCount;
  }

  return WORD_SEQUENCE_LENGTH;
};

const Page = () => {
  const settings = useSettingsStore((state) => state.settings);
  const setSettings = useSettingsStore((state) => state.setSettings);
  const [words, setWords] = useState(() => {
    const activity = getActivityType(settings.language);
    const length = getSequenceLength(settings);
    return activity === "CODE"
      ? generateSnippets(
          settings.language as
            | "javascript"
            | "cpp"
            | "python"
            | "rust"
            | "typescript",
          length,
        )
      : generateWordSequence(length);
  });
  const [timeLeft, setTimeLeft] = useState<number>(settings.timer);
  const [isRunning, setIsRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedWords, setCompletedWords] = useState<CompletedItem[]>([]);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const series = useEditorStore((state) => state.series);
  const typingStartedAt = useEditorStore((state) => state.typingStartedAt);
  const currentInput = useEditorStore((state) => state.currentInput);
  const currentWordIndex = useEditorStore((state) => state.currentWordIndex);
  const keystrokes = useEditorStore((state) => state.keystrokes);
  const resetTypingState = useEditorStore((state) => state.resetTypingState);
  const { isSignedIn } = useAuth();
  const lastSavedAtRef = useRef<number | null>(null);

  const regenerateWords = useCallback(() => {
    const activity = getActivityType(settings.language);
    const length = getSequenceLength(settings);
    setWords(
      activity === "CODE"
        ? generateSnippets(
            settings.language as
              | "javascript"
              | "cpp"
              | "python"
              | "rust"
              | "typescript",
            length,
          )
        : generateWordSequence(length),
    );
    setIsRunning(false);
    setHasEnded(false);
    setTimeLeft(settings.timer);
    setCompletedWords([]);
    setEndedAt(null);
    setElapsedSeconds(0);
  }, [settings]);

  const isTimerMode = settings.mode === "timer";
  const isWordsMode = settings.mode === "words";
  const isSnippetsMode = settings.mode === "snippets";
  const isFixMode = settings.mode === "fix";

  useEffect(() => {
    if (!(isTimerMode || isFixMode) || !isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setHasEnded(true);
          setIsRunning(false);
          setEndedAt(Date.now());
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, isTimerMode, isFixMode]);

  const handleTypingStart = useCallback(() => {
    if (hasEnded || isRunning) {
      return;
    }

    if (isTimerMode || isWordsMode || isSnippetsMode || isFixMode) {
      setIsRunning(true);
    }
  }, [
    hasEnded,
    isRunning,
    isTimerMode,
    isWordsMode,
    isSnippetsMode,
    isFixMode,
  ]);

  const handleRestart = useCallback(() => {
    setIsRunning(false);
    setHasEnded(false);
    setTimeLeft(settings.timer);
    setCompletedWords([]);
    setEndedAt(null);
    setElapsedSeconds(0);
    const activity = getActivityType(settings.language);
    const length = getSequenceLength(settings);
    setWords(
      activity === "CODE"
        ? generateSnippets(
            settings.language as
              | "javascript"
              | "cpp"
              | "python"
              | "rust"
              | "typescript",
            length,
          )
        : generateWordSequence(length),
    );
  }, [settings]);

  const handleSettingsChange = useCallback(
    (nextSettings: FilterPreferences) => {
      const modeChanged = nextSettings.mode !== settings.mode;
      const timerChanged = nextSettings.timer !== settings.timer;
      const wordCountChanged = nextSettings.wordCount !== settings.wordCount;
      const languageChanged = nextSettings.language !== settings.language;
      const snippetCountChanged =
        nextSettings.snippetCount !== settings.snippetCount;

      if (
        modeChanged ||
        timerChanged ||
        wordCountChanged ||
        languageChanged ||
        snippetCountChanged
      ) {
        setIsRunning(false);
        setHasEnded(false);
        setTimeLeft(nextSettings.timer);
        setEndedAt(null);
        setCompletedWords([]);
        setElapsedSeconds(0);
        if (modeChanged || languageChanged) {
          resetTypingState();
        }

        const activity = getActivityType(nextSettings.language);
        const length = getSequenceLength(nextSettings);
        setWords(
          activity === "CODE"
            ? generateSnippets(
                nextSettings.language as
                  | "javascript"
                  | "cpp"
                  | "python"
                  | "rust"
                  | "typescript",
                length,
              )
            : generateWordSequence(length),
        );
      }

      setSettings(nextSettings);
    },
    [resetTypingState, setSettings, settings],
  );

  const durationSeconds = useMemo(() => {
    if (typingStartedAt && endedAt) {
      const elapsed = Math.round((endedAt - typingStartedAt) / 1000);
      return Math.max(elapsed, 0);
    }

    if (isTimerMode) {
      return settings.timer;
    }

    return series.length > 0 ? series[series.length - 1].second : 0;
  }, [endedAt, isTimerMode, series, settings.timer, typingStartedAt]);

  const metrics = useMemo(() => {
    if (!hasEnded) {
      return null;
    }

    return calculateResultsMetrics({
      completedWords,
      words,
      durationSeconds,
      series,
      currentInput,
      currentTarget: words[currentWordIndex] ?? "",
      keystrokes,
      language: settings.language,
    });
  }, [
    completedWords,
    currentInput,
    currentWordIndex,
    durationSeconds,
    hasEnded,
    series,
    words,
    keystrokes,
    settings.language,
  ]);

  useEffect(() => {
    if (
      !(isWordsMode || isSnippetsMode || isFixMode) ||
      !isRunning ||
      hasEnded
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (!typingStartedAt) {
        setElapsedSeconds(0);
        return;
      }

      const elapsed = Math.floor((Date.now() - typingStartedAt) / 1000);
      setElapsedSeconds(Math.max(elapsed, 0));
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [
    hasEnded,
    isRunning,
    isWordsMode,
    typingStartedAt,
    isSnippetsMode,
    isFixMode,
  ]);

  const handleStatsChange = useCallback(
    (nextCompletedWords: CompletedItem[]) => {
      setCompletedWords(nextCompletedWords);

      const isWords = getActivityType(settings.language) === "TEXT";

      if (isWords) {
        if (
          !isWordsMode ||
          hasEnded ||
          nextCompletedWords.length < settings.wordCount
        ) {
          return;
        }
      } else {
        // Snippets mode logic (Fix mode is timed, so it doesn't end based on count)
        if (
          !isSnippetsMode ||
          hasEnded ||
          nextCompletedWords.length < (settings.snippetCount || 5)
        ) {
          return;
        }
      }

      const endTimestamp = Date.now();
      setHasEnded(true);
      setIsRunning(false);
      setEndedAt(endTimestamp);
      if (typingStartedAt) {
        const elapsed = Math.round((endTimestamp - typingStartedAt) / 1000);
        setElapsedSeconds(Math.max(elapsed, 0));
      }
    },
    [
      hasEnded,
      isSnippetsMode,
      isWordsMode,
      settings.language,
      settings.snippetCount,
      settings.wordCount,
      typingStartedAt,
    ],
  );

  useEffect(() => {
    if (!hasEnded || !isSignedIn || !metrics || !endedAt) {
      return;
    }

    if (lastSavedAtRef.current === endedAt) {
      return;
    }

    const languageMap = {
      english: "ENGLISH",
      cpp: "CPP",
      python: "PYTHON",
      javascript: "JAVASCRIPT",
      rust: "RUST",
      typescript: "TYPESCRIPT",
    } as const;
    const modeMap = {
      timer: "TIMER",
      words: "WORDS",
      snippets: "SNIPPETS",
      fix: "FIX",
    } as const;
    const editorMap = {
      text: "TEXT",
      vscode: "VSCODE",
      vim: "VIM",
    } as const;

    const payload = {
      activity: getActivityType(settings.language),
      language: languageMap[settings.language],
      mode: modeMap[settings.mode],
      editor: editorMap[settings.editorMode],
      config: {
        timerSeconds:
          settings.mode === "timer" || settings.mode === "fix"
            ? settings.timer
            : undefined,
        wordCount: settings.mode === "words" ? settings.wordCount : undefined,
        snippetCount:
          settings.mode === "snippets" ? settings.snippetCount : undefined,
      },
      result: {
        durationSeconds: metrics.durationSeconds,
        wpm: metrics.wpm,
        rawWpm: metrics.rawWpm,
        accuracy: metrics.accuracy,
        errors: metrics.errors,
        consistency: metrics.consistency,
        snippetsCompleted:
          getActivityType(settings.language) === "CODE"
            ? completedWords.length
            : undefined,
        snippetsPerMinute:
          getActivityType(settings.language) === "CODE" &&
          metrics.durationSeconds > 0
            ? (completedWords.length / metrics.durationSeconds) * 60
            : undefined,
      },
      series: series.map((point) => ({
        second: point.second,
        wpm: point.wpm,
        rawWpm: point.rawWpm,
        errors: point.errors,
        snippetsDone: point.snippetsDone,
      })),
    };

    const saveRun = async () => {
      try {
        const response = await fetch("/api/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error("Failed to save run", response.status);
          return;
        }

        lastSavedAtRef.current = endedAt;
      } catch (error) {
        console.error("Failed to save run", error);
      }
    };

    void saveRun();
  }, [
    endedAt,
    hasEnded,
    isSignedIn,
    metrics,
    series,
    settings,
    completedWords.length,
  ]);

  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between">
      <Tracker />
      <Navbar onKeyboardClick={regenerateWords} />
      <div className="mb-24">
        {!hasEnded && (
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        )}
        {(isTimerMode || isFixMode) && isRunning && !hasEnded && (
          <div className="font-roboto-mono text-muted-foreground mt-6 w-full text-left text-2xl">
            {timeLeft}
          </div>
        )}
        {(isWordsMode || isSnippetsMode) && isRunning && !hasEnded && (
          <div className="font-roboto-mono text-muted-foreground mt-6 w-full text-left text-2xl">
            {elapsedSeconds}
          </div>
        )}
        {hasEnded ? (
          <ResultsPanel
            words={words}
            completedWords={completedWords}
            currentInput={currentInput}
            currentWordIndex={currentWordIndex}
            durationSeconds={durationSeconds}
            settings={settings}
            series={series}
            onRestart={handleRestart}
            keystrokes={keystrokes}
            language={settings.language}
          />
        ) : (
          <Editor
            words={words}
            isActive={!hasEnded}
            onTypingStart={handleTypingStart}
            onStatsChange={handleStatsChange}
            onRestart={handleRestart}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
