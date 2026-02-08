"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { memo, useState } from "react";
import { defaultFilterPreferences } from "@/lib/filter-options";

// Lazy load FilterDialog - only loaded when user interacts with filters
const FilterDialog = dynamic(() => import("@/app/leaderboard/filter-dialog"), {
  loading: () => (
    <Button
      variant="outline"
      size="sm"
      className="border-muted bg-background font-press-start-2p text-[0.6rem] tracking-[0.25em] uppercase opacity-50 shadow-md"
      disabled
    >
      Filters
    </Button>
  ),
});

interface LeaderboardEntry {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  raw: number;
  consistency: number;
  date: string;
}

// Memoized table - won't re-render when parent filter state changes
const LeaderboardTable = memo(function LeaderboardTable({
  data,
}: {
  data: LeaderboardEntry[];
}) {
  return (
    <div className="no-scrollbar mt-8 mb-4 min-h-0 w-full flex-1 overflow-y-auto">
      <div className="no-scrollbar h-full overflow-y-auto border">
        <table className="w-full">
          <thead className="bg-background sticky top-0 z-10">
            <tr className="bg-muted/50 border-b">
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                WPM
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Accuracy
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Raw
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Consistency
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.rank}
                className="hover:bg-muted/30 border-b transition-colors"
              >
                <td className="text-muted-foreground px-4 py-3 text-sm">
                  {entry.rank}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                      <span className="text-xs">
                        {entry.name[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {entry.wpm.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {entry.accuracy.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {entry.raw.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {entry.consistency.toFixed(2)}%
                </td>
                <td className="text-muted-foreground px-4 py-3 text-right text-sm">
                  {entry.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

interface LeaderboardContentProps {
  initialData: LeaderboardEntry[];
  totalPages: number;
}

export default function LeaderboardContent({
  initialData,
  totalPages,
}: LeaderboardContentProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Consolidated filter state - single state update instead of 5 separate ones
  const [filters, setFilters] = useState(defaultFilterPreferences);

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="my-8 flex items-center justify-between">
        <FilterDialog
          editorMode={filters.editorMode}
          language={filters.language}
          timer={filters.timer}
          mode={filters.mode}
          wordCount={filters.wordCount}
          onEditorModeChange={(v) => updateFilter("editorMode", v)}
          onLanguageChange={(v) => updateFilter("language", v)}
          onTimerChange={(v) => updateFilter("timer", v)}
          onModeChange={(v) => updateFilter("mode", v)}
          onWordCountChange={(v) => updateFilter("wordCount", v)}
        />
        <h1 className="text-2xl font-bold tracking-[0.25em] uppercase">
          Leaderboard
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="shadow-md"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          <span className="min-w-[5rem] text-center">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="shadow-md"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
        </div>
      </div>

      {/* Selected Filters Display */}
      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
        <span className="font-medium">Active Filters:</span>
        <span className="bg-muted px-2 py-0.5 shadow-md">
          {filters.editorMode}
        </span>
        <span className="bg-muted px-2 py-0.5 shadow-md">
          {filters.language}
        </span>
        <span className="bg-muted px-2 py-0.5 shadow-md">{filters.mode}</span>
        {filters.mode === "timer" && (
          <span className="bg-muted px-2 py-0.5 shadow-md">
            {filters.timer}s
          </span>
        )}
        {filters.mode === "words" && (
          <span className="bg-muted px-2 py-0.5 shadow-md">
            {filters.wordCount} words
          </span>
        )}
      </div>

      {/* Leaderboard Table - Memoized to prevent re-renders on filter changes */}
      <LeaderboardTable data={initialData} />
    </div>
  );
}
