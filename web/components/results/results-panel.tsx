import { useMemo } from "react";

import type { CompletedItem } from "@/types/editor";
import type { FilterPreferences } from "@/lib/filter-options";
import type { ResultSeriesPoint } from "@/types/results";
import { calculateResultsMetrics } from "@/lib/results-metrics";
import ResultsChart from "@/components/results/results-chart";
import CallToAction from "./call-to-action";
import { Button } from "../ui/button";

const formatNumber = (value: number) =>
  Number.isFinite(value) ? value.toFixed(0) : "0";

const formatPercent = (value: number) =>
  Number.isFinite(value) ? `${value.toFixed(0)}%` : "0%";

const getTestTypeLabel = (
  mode: FilterPreferences["mode"],
  durationSeconds: number,
  wordCount: FilterPreferences["wordCount"],
  timer: FilterPreferences["timer"],
  snippetCount?: number,
) => {
  if (mode === "timer") {
    return `timer ${timer}s`;
  }

  if (mode === "words") {
    return `words ${wordCount} · ${durationSeconds}s`;
  }

  if (mode === "snippets") {
    return `snippets ${snippetCount || 5} · ${durationSeconds}s`;
  }
  return `timer ${timer}s`;
};

type ResultsPanelProps = {
  words: string[];
  completedWords: CompletedItem[];
  currentInput: string;
  currentWordIndex: number;
  durationSeconds: number;
  settings: FilterPreferences;
  series: ResultSeriesPoint[];
  onRestart?: () => void;
  keystrokes?: number;
  language?: string;
};

const ResultsPanel = ({
  words,
  completedWords,
  currentInput,
  currentWordIndex,
  durationSeconds,
  settings,
  series,
  onRestart,
  keystrokes,
  language,
}: ResultsPanelProps) => {
  const metrics = useMemo(
    () =>
      calculateResultsMetrics({
        completedWords,
        words,
        durationSeconds,
        series,
        currentInput,
        currentTarget: words[currentWordIndex] ?? "",
        keystrokes,
        language,
      }),
    [
      completedWords,
      words,
      durationSeconds,
      series,
      currentInput,
      currentWordIndex,
      keystrokes,
      language,
    ],
  );

  const isCodeMode =
    language === "javascript" ||
    (completedWords.length > 0 && "code" in completedWords[0]);

  if (isCodeMode) {
    const snippetsPerMinute =
      durationSeconds > 0 ? (completedWords.length / durationSeconds) * 60 : 0;

    return (
      <div className="mt-20 flex w-full flex-col items-center justify-center gap-12">
        <div className="flex gap-16">
          <div className="flex flex-col items-center">
            <div className="text-muted-foreground text-sm tracking-widest uppercase">
              Snippets Done
            </div>
            <div className="font-roboto-mono text-primary text-7xl leading-none font-black">
              {completedWords.length}
            </div>
          </div>
          <div className="flex flex-col items-center border-x px-16">
            <div className="text-muted-foreground text-sm tracking-widest uppercase">
              Snippets / Min
            </div>
            <div className="font-roboto-mono text-primary text-7xl leading-none font-black">
              {snippetsPerMinute.toFixed(1)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-muted-foreground text-sm tracking-widest uppercase">
              Time Taken
            </div>
            <div className="font-roboto-mono text-primary text-7xl leading-none font-black">
              {durationSeconds}s
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {onRestart ? (
            <Button
              variant="ghost"
              onClick={onRestart}
              className="hover:bg-primary/10 text-muted-foreground hover:text-primary cursor-pointer border px-8 py-6 text-xl shadow-md transition-all"
            >
              Restart
            </Button>
          ) : null}
          <CallToAction />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 flex w-full flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-muted-foreground text-xs uppercase">wpm</div>
            <div className="font-roboto-mono text-6xl leading-none">
              {formatNumber(metrics.wpm)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs uppercase">acc</div>
            <div className="font-roboto-mono text-5xl leading-none">
              {formatPercent(metrics.accuracy)}
            </div>
          </div>
          {metrics.snippetsPerSecond !== undefined && (
            <div className="border-primary/20 bg-primary/5 hover:bg-primary/10 border-l-4 p-3 shadow-sm transition-all">
              <div className="text-primary text-[10px] font-bold tracking-wider uppercase">
                Snippets Written
              </div>
              <div className="font-roboto-mono text-primary text-4xl leading-none font-black">
                {completedWords.length}
              </div>
              <div className="text-muted-foreground mt-1 text-[10px] italic">
                {metrics.snippetsPerSecond.toFixed(2)} per sec
              </div>
            </div>
          )}
          <div className="text-muted-foreground font-roboto-mono text-xs">
            <div>raw: {metrics.rawWpm.toFixed(0)}</div>
            <div>errors: {metrics.errors}</div>
            <div>consistency: {formatPercent(metrics.consistency)}</div>
          </div>
        </div>
        <ResultsChart series={series} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card ring-foreground/10 rounded-none p-4 ring-1">
          <div className="text-muted-foreground text-xs uppercase">
            test type
          </div>
          <div className="font-roboto-mono mt-2 text-sm">
            <div>
              {getTestTypeLabel(
                settings.mode,
                durationSeconds,
                settings.wordCount,
                settings.timer,
                settings.snippetCount,
              )}
            </div>
          </div>
        </div>
        <div className="bg-card ring-foreground/10 rounded-none p-4 ring-1">
          <div className="text-muted-foreground text-xs uppercase">
            characters
          </div>
          <div className="font-roboto-mono mt-2 text-sm">
            {metrics.characters.correct}/{metrics.characters.incorrect}/
            {metrics.characters.extra}/{metrics.characters.missed}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        {onRestart ? (
          <Button
            variant="ghost"
            onClick={onRestart}
            className="cursor-pointer shadow-md"
          >
            Restart
          </Button>
        ) : null}
        <CallToAction />
      </div>
    </div>
  );
};

export default ResultsPanel;
