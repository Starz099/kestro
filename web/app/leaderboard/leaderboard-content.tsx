"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { defaultFilterPreferences } from "@/lib/filter-options";
import LeaderboardTable, { type LeaderboardEntry } from "./leaderboard-table";

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

type LeaderboardResponse = {
  data: LeaderboardEntry[];
};

interface LeaderboardContentProps {
  initialData: LeaderboardEntry[];
}

export default function LeaderboardContent({
  initialData,
}: LeaderboardContentProps) {
  const [filters, setFilters] = useState(defaultFilterPreferences);
  const [data, setData] = useState(initialData);
  const [isLoadingState, setIsLoadingState] = useState(() => {
    const isDefaultSupported =
      (defaultFilterPreferences.mode === "timer" ||
        defaultFilterPreferences.mode === "words") &&
      defaultFilterPreferences.language === "english" &&
      defaultFilterPreferences.editorMode === "text";
    return isDefaultSupported;
  });

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      setIsLoadingState(true);
      return next;
    });
  };

  const filteredData = data;
  const isEmpty = filteredData.length === 0;
  const isLoading = isLoadingState;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      mode: filters.mode,
      language: filters.language,
      editor: filters.editorMode,
    });

    if (filters.mode === "timer") {
      params.set("timer", String(filters.timer));
    }
    if (filters.mode === "words") {
      params.set("wordCount", String(filters.wordCount));
    }
    if (filters.mode === "snippets") {
      params.set("snippetCount", String(filters.snippetCount));
    }

    axios
      .get<LeaderboardResponse>(`/api/leaderboard?${params.toString()}`, {
        signal: controller.signal,
      })
      .then((response) => {
        setData(response.data.data ?? []);
      })
      .catch((error) => {
        if (error?.name !== "CanceledError") {
          setData([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingState(false);
        }
      });

    return () => controller.abort();
  }, [
    filters.editorMode,
    filters.language,
    filters.mode,
    filters.timer,
    filters.wordCount,
    filters.snippetCount,
  ]);

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
          snippetCount={filters.snippetCount}
          onEditorModeChange={(v) => updateFilter("editorMode", v)}
          onLanguageChange={(v) => updateFilter("language", v)}
          onTimerChange={(v) => updateFilter("timer", v)}
          onModeChange={(v) => updateFilter("mode", v)}
          onWordCountChange={(v) => updateFilter("wordCount", v)}
          onSnippetCountChange={(v) => updateFilter("snippetCount", v)}
        />
        <h1 className="text-2xl font-bold tracking-[0.25em] uppercase">
          Leaderboard
        </h1>
        <div />
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
        {filters.mode === "snippets" && (
          <span className="bg-muted px-2 py-0.5 shadow-md">
            {filters.snippetCount} snippets
          </span>
        )}
      </div>

      {/* Leaderboard Table - Memoized to prevent re-renders on filter changes */}
      <LeaderboardTable
        data={filteredData}
        isEmpty={isEmpty}
        isLoading={isLoading}
      />
    </div>
  );
}
