"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Editor from "@/components/editor/editor";
import Footer from "@/components/footer";
import SettingsPanel from "@/components/settings-panel";
import Navbar from "@/components/navbar";
import { generateWordSequence } from "@/lib/word-generator";
import type { FilterPreferences } from "@/lib/filter-options";
import type { CompletedWord } from "@/types/editor";
import { useSettingsStore } from "@/store/settings-store";
import { useEditorStore } from "@/store/editor-store";
import ResultsPanel from "@/components/results/results-panel";

const WORD_SEQUENCE_LENGTH = 700;

const Page = () => {
  const [words, setWords] = useState(() =>
    generateWordSequence(WORD_SEQUENCE_LENGTH),
  );
  const settings = useSettingsStore((state) => state.settings);
  const setSettings = useSettingsStore((state) => state.setSettings);
  const [timeLeft, setTimeLeft] = useState<number>(settings.timer);
  const [isRunning, setIsRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const series = useEditorStore((state) => state.series);
  const typingStartedAt = useEditorStore((state) => state.typingStartedAt);
  const currentInput = useEditorStore((state) => state.currentInput);
  const currentWordIndex = useEditorStore((state) => state.currentWordIndex);

  const regenerateWords = useCallback(() => {
    setWords(generateWordSequence(WORD_SEQUENCE_LENGTH));
  }, []);

  const isTimerMode = settings.mode === "timer";

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
    if (!isTimerMode || hasEnded || isRunning) {
      return;
    }

    setIsRunning(true);
  }, [hasEnded, isRunning, isTimerMode]);

  const handleRestart = useCallback(() => {
    if (!isTimerMode) {
      return;
    }

    setIsRunning(false);
    setHasEnded(false);
    setTimeLeft(settings.timer);
    setCompletedWords([]);
    setEndedAt(null);
  }, [isTimerMode, settings.timer]);

  const handleSettingsChange = useCallback(
    (nextSettings: FilterPreferences) => {
      const modeChanged = nextSettings.mode !== settings.mode;
      const timerChanged = nextSettings.timer !== settings.timer;

      if (modeChanged || timerChanged) {
        setIsRunning(false);
        setHasEnded(false);
        setTimeLeft(nextSettings.timer);
        setEndedAt(null);
      }

      setSettings(nextSettings);
    },
    [setSettings, settings.mode, settings.timer],
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
        {isTimerMode && hasEnded ? (
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
            isActive={!isTimerMode || !hasEnded}
            onTypingStart={handleTypingStart}
            onStatsChange={setCompletedWords}
            onRestart={handleRestart}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
