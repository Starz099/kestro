import type {
  CompletedWord,
  CompletedSnippet,
  CompletedItem,
} from "@/types/editor";
import type {
  CharacterBreakdown,
  ResultsMetrics,
  ResultSeriesPoint,
} from "@/types/results";

const BASE_WORD_LENGTH = 5;

const roundTo = (value: number, decimals = 2) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const compareItem = (typed: string, target: string): CharacterBreakdown => {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  const minLength = Math.min(typed.length, target.length);

  for (let index = 0; index < minLength; index += 1) {
    if (typed[index] === target[index]) {
      correct += 1;
    } else {
      incorrect += 1;
    }
  }

  if (typed.length > target.length) {
    extra += typed.length - target.length;
  } else if (target.length > typed.length) {
    missed += target.length - typed.length;
  }

  return { correct, incorrect, extra, missed };
};

export const calculatePartialBreakdown = (
  typed: string,
  target: string,
): CharacterBreakdown => {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;

  const minLength = Math.min(typed.length, target.length);

  for (let index = 0; index < minLength; index += 1) {
    if (typed[index] === target[index]) {
      correct += 1;
    } else {
      incorrect += 1;
    }
  }

  if (typed.length > target.length) {
    extra += typed.length - target.length;
  }

  return { correct, incorrect, extra, missed: 0 };
};

export const calculateCharacterBreakdown = (
  completedItems: CompletedItem[],
  items: string[],
): CharacterBreakdown => {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  completedItems.forEach((entry, index) => {
    const target = items[index] ?? "";
    const typed = "word" in entry ? entry.word : entry.code;
    const {
      correct: c,
      incorrect: i,
      extra: e,
      missed: m,
    } = compareItem(typed, target);

    correct += c;
    incorrect += i;
    extra += e;
    missed += m;
  });

  return { correct, incorrect, extra, missed };
};

export const calculateAccuracy = (breakdown: CharacterBreakdown): number => {
  const totalTyped = breakdown.correct + breakdown.incorrect + breakdown.extra;

  if (totalTyped === 0) {
    return 0;
  }

  return roundTo((breakdown.correct / totalTyped) * 100, 2);
};

export const calculateWpm = (
  correctChars: number,
  durationSeconds: number,
): number => {
  if (durationSeconds <= 0) {
    return 0;
  }

  const minutes = durationSeconds / 60;
  return roundTo(correctChars / BASE_WORD_LENGTH / minutes, 2);
};

export const calculateRawWpm = (
  keystrokes: number,
  durationSeconds: number,
): number => {
  if (durationSeconds <= 0) {
    return 0;
  }

  const minutes = durationSeconds / 60;
  return roundTo(keystrokes / BASE_WORD_LENGTH / minutes, 2);
};

export const calculateErrors = (breakdown: CharacterBreakdown): number =>
  breakdown.incorrect + breakdown.extra + breakdown.missed;

export const calculateConsistency = (
  series: ResultSeriesPoint[] = [],
): number => {
  if (series.length <= 1) {
    return 100;
  }

  const values = series.map((point) => point.wpm);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  if (mean === 0) {
    return 0;
  }

  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  const ratio = standardDeviation / mean;

  return roundTo(clamp(100 - ratio * 100, 0, 100), 2);
};

type MetricsInput = {
  completedWords: CompletedItem[];
  words: string[];
  durationSeconds: number;
  series?: ResultSeriesPoint[];
  currentInput?: string;
  currentTarget?: string;
  keystrokes?: number;
  language?: string;
};

export const calculateResultsMetrics = ({
  completedWords,
  words,
  durationSeconds,
  series = [],
  currentInput,
  currentTarget,
  keystrokes = 0,
  language,
}: MetricsInput): ResultsMetrics => {
  const completedBreakdown = calculateCharacterBreakdown(completedWords, words);
  const hasPartial = currentInput !== undefined && currentTarget !== undefined;
  const partial = hasPartial
    ? calculatePartialBreakdown(currentInput ?? "", currentTarget ?? "")
    : { correct: 0, incorrect: 0, extra: 0, missed: 0 };
  const characters = {
    correct: completedBreakdown.correct + partial.correct,
    incorrect: completedBreakdown.incorrect + partial.incorrect,
    extra: completedBreakdown.extra + partial.extra,
    missed: completedBreakdown.missed,
  };
  const wpm = calculateWpm(characters.correct, durationSeconds);
  const rawWpm = calculateRawWpm(keystrokes, durationSeconds);
  const accuracy = calculateAccuracy(characters);
  const errors = calculateErrors(characters);
  const consistency = calculateConsistency(series);

  let snippetsPerSecond: number | undefined;
  const isCode =
    language === "javascript" ||
    language === "cpp" ||
    (completedWords.length > 0 && "code" in completedWords[0]);

  if (isCode) {
    snippetsPerSecond =
      durationSeconds > 0
        ? roundTo(completedWords.length / durationSeconds, 2)
        : 0;
  }

  return {
    wpm,
    rawWpm,
    accuracy,
    errors,
    consistency,
    durationSeconds,
    characters,
    snippetsPerSecond,
  };
};
