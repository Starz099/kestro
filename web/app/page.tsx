"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Editor from "@/components/editor/editor";
import Footer from "@/components/footer";
import SettingsPanel from "@/components/settings-panel";
import Navbar from "@/components/navbar";
import { generateWordSequence } from "@/lib/word-generator";
import {
  defaultFilterPreferences,
  type FilterPreferences,
} from "@/lib/filter-options";
import type { CompletedWord } from "@/types/editor";

const WORD_SEQUENCE_LENGTH = 700;

const Page = () => {
  const [words, setWords] = useState(() =>
    generateWordSequence(WORD_SEQUENCE_LENGTH),
  );
  const [settings, setSettings] = useState<FilterPreferences>(
    defaultFilterPreferences,
  );
  const [timeLeft, setTimeLeft] = useState<number>(settings.timer);
  const [isRunning, setIsRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);

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
  }, [isTimerMode, settings.timer]);

  const handleSettingsChange = useCallback(
    (nextSettings: FilterPreferences) => {
      const modeChanged = nextSettings.mode !== settings.mode;
      const timerChanged = nextSettings.timer !== settings.timer;

      if (modeChanged || timerChanged) {
        setIsRunning(false);
        setHasEnded(false);
        setTimeLeft(nextSettings.timer);
      }

      setSettings(nextSettings);
    },
    [settings.mode, settings.timer],
  );

  const endStats = useMemo(() => {
    const wrongWords = completedWords.filter((word) => !word.isCorrect).length;
    return {
      totalWords: completedWords.length,
      wrongWords,
    };
  }, [completedWords]);

  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between">
      <Navbar onKeyboardClick={regenerateWords} />
      <div className="mb-24">
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
        {isTimerMode && isRunning && !hasEnded && (
          <div className="font-roboto-mono text-muted-foreground mt-6 w-full text-left text-2xl">
            {timeLeft}
          </div>
        )}
        {isTimerMode && hasEnded ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <h2 className="font-roboto-mono text-2xl font-semibold">
              Game Ended
            </h2>
            <div className="text-muted-foreground font-roboto-mono text-sm">
              <span>Words written: {endStats.totalWords}</span>
            </div>
            <div className="text-muted-foreground font-roboto-mono text-sm">
              <span>Wrong words: {endStats.wrongWords}</span>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="bg-muted text-muted-foreground hover:text-foreground mt-2 rounded-sm border px-4 py-1.5 text-sm transition-colors"
            >
              Restart
            </button>
          </div>
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
