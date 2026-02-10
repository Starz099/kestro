import { useMemo } from "react";

import type { CompletedWord } from "@/types/editor";
import type { FilterPreferences } from "@/lib/filter-options";
import type { ResultSeriesPoint } from "@/types/results";
import { calculateResultsMetrics } from "@/lib/results-metrics";
import ResultsChart from "@/components/results/results-chart";

const formatNumber = (value: number) =>
  Number.isFinite(value) ? value.toFixed(0) : "0";

const formatPercent = (value: number) =>
  Number.isFinite(value) ? `${value.toFixed(0)}%` : "0%";

type ResultsPanelProps = {
  words: string[];
  completedWords: CompletedWord[];
  currentInput: string;
  currentWordIndex: number;
  durationSeconds: number;
  settings: FilterPreferences;
  series: ResultSeriesPoint[];
  onRestart?: () => void;
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
      }),
    [
      completedWords,
      words,
      durationSeconds,
      series,
      currentInput,
      currentWordIndex,
    ],
  );

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
              {settings.mode} {durationSeconds}s
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

      {onRestart ? (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="bg-muted text-muted-foreground hover:text-foreground rounded-sm border px-4 py-1.5 text-sm transition-colors"
          >
            Restart
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ResultsPanel;
