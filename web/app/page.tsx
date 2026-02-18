"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Editor from "@/components/editor/editor";
import Footer from "@/components/footer";
import SettingsPanel from "@/components/settings-panel";
import Navbar from "@/components/navbar";
import { generateWordSequence } from "@/lib/word-generator";
import { getActivityType, type FilterPreferences } from "@/lib/filter-options";
import type { CompletedWord } from "@/types/editor";
import { useSettingsStore } from "@/store/settings-store";
import { useEditorStore } from "@/store/editor-store";
import ResultsPanel from "@/components/results/results-panel";
import { calculateResultsMetrics } from "@/lib/results-metrics";

const WORD_SEQUENCE_LENGTH = 700;

const getWordSequenceLength = (mode: string, wordCount: number) => {
  if (mode === "words") {
    return wordCount;
  }

  return WORD_SEQUENCE_LENGTH;
};

const Page = () => {
  const settings = useSettingsStore((state) => state.settings);
  const setSettings = useSettingsStore((state) => state.setSettings);
  const [words, setWords] = useState(() =>
    generateWordSequence(
      getWordSequenceLength(settings.mode, settings.wordCount),
    ),
  );
  const [timeLeft, setTimeLeft] = useState<number>(settings.timer);
  const [isRunning, setIsRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const series = useEditorStore((state) => state.series);
  const typingStartedAt = useEditorStore((state) => state.typingStartedAt);
  const currentInput = useEditorStore((state) => state.currentInput);
  const currentWordIndex = useEditorStore((state) => state.currentWordIndex);
  const resetTypingState = useEditorStore((state) => state.resetTypingState);
  const { isSignedIn } = useAuth();
  const lastSavedAtRef = useRef<number | null>(null);

  const regenerateWords = useCallback(() => {
    setWords(
      generateWordSequence(
        getWordSequenceLength(settings.mode, settings.wordCount),
      ),
    );
    setIsRunning(false);
    setHasEnded(false);
    setTimeLeft(settings.timer);
    setCompletedWords([]);
    setEndedAt(null);
    setElapsedSeconds(0);
  }, [settings.mode, settings.timer, settings.wordCount]);

  const isTimerMode = settings.mode === "timer";
  const isWordsMode = settings.mode === "words";

  useEffect(() => {
    if (!isTimerMode || !isRunning) {
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
  }, [isRunning, isTimerMode]);

  const handleTypingStart = useCallback(() => {
    if (hasEnded || isRunning) {
      return;
    }

    if (isTimerMode || isWordsMode) {
      setIsRunning(true);
    }
  }, [hasEnded, isRunning, isTimerMode, isWordsMode]);

  const handleRestart = useCallback(() => {
    setIsRunning(false);
    setHasEnded(false);
    setTimeLeft(settings.timer);
    setCompletedWords([]);
    setEndedAt(null);
    setElapsedSeconds(0);
    setWords(
      generateWordSequence(
        getWordSequenceLength(settings.mode, settings.wordCount),
      ),
    );
  }, [settings.mode, settings.timer, settings.wordCount]);

  const handleSettingsChange = useCallback(
    (nextSettings: FilterPreferences) => {
      const modeChanged = nextSettings.mode !== settings.mode;
      const timerChanged = nextSettings.timer !== settings.timer;
      const wordCountChanged = nextSettings.wordCount !== settings.wordCount;

      if (modeChanged || timerChanged || wordCountChanged) {
        setIsRunning(false);
        setHasEnded(false);
        setTimeLeft(nextSettings.timer);
        setEndedAt(null);
        setCompletedWords([]);
        setElapsedSeconds(0);
        if (modeChanged) {
          resetTypingState();
        }
        setWords(
          generateWordSequence(
            getWordSequenceLength(nextSettings.mode, nextSettings.wordCount),
          ),
        );
      }

      setSettings(nextSettings);
    },
    [
      resetTypingState,
      setSettings,
      settings.mode,
      settings.timer,
      settings.wordCount,
    ],
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
    });
  }, [
    completedWords,
    currentInput,
    currentWordIndex,
    durationSeconds,
    hasEnded,
    series,
    words,
  ]);

  useEffect(() => {
    if (!isWordsMode || !isRunning || hasEnded) {
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
  }, [hasEnded, isRunning, isWordsMode, typingStartedAt]);

  const handleStatsChange = useCallback(
    (nextCompletedWords: CompletedWord[]) => {
      setCompletedWords(nextCompletedWords);

      if (
        !isWordsMode ||
        hasEnded ||
        nextCompletedWords.length < settings.wordCount
      ) {
        return;
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
    [hasEnded, isWordsMode, settings.wordCount, typingStartedAt],
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
      "c++": "CPP",
      python: "PYTHON",
      javascript: "JAVASCRIPT",
    } as const;
    const modeMap = {
      timer: "TIMER",
      words: "WORDS",
      snippets: "SNIPPETS",
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
        timerSeconds: settings.mode === "timer" ? settings.timer : undefined,
        wordCount: settings.mode === "words" ? settings.wordCount : undefined,
      },
      result: {
        durationSeconds: metrics.durationSeconds,
        wpm: metrics.wpm,
        rawWpm: metrics.rawWpm,
        accuracy: metrics.accuracy,
        errors: metrics.errors,
        consistency: metrics.consistency,
      },
      series: series.map((point) => ({
        second: point.second,
        wpm: point.wpm,
        rawWpm: point.rawWpm,
        errors: point.errors,
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
  }, [endedAt, hasEnded, isSignedIn, metrics, series, settings]);

  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between">
      <Navbar onKeyboardClick={regenerateWords} />
      <div className="mb-24">
        {!hasEnded && (
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        )}
        {isTimerMode && isRunning && !hasEnded && (
          <div className="font-roboto-mono text-muted-foreground mt-6 w-full text-left text-2xl">
            {timeLeft}
          </div>
        )}
        {isWordsMode && isRunning && !hasEnded && (
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
