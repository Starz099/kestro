import type { FilterPreferences } from "@/lib/filter-options";

export type CharacterBreakdown = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
};

export type ResultsMetrics = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  consistency: number;
  durationSeconds: number;
  characters: CharacterBreakdown;
  snippetsPerSecond?: number;
};

export type ResultSeriesPoint = {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
};

export type TestConfig = FilterPreferences;

export type TestResult = {
  id: string;
  createdAt: string;
  config: TestConfig;
  metrics: ResultsMetrics;
  series: ResultSeriesPoint[];
};
