import type { CompletedWord } from "@/types/editor";
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

const compareWord = (typed: string, target: string): CharacterBreakdown => {
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
  completedWords: CompletedWord[],
  words: string[],
): CharacterBreakdown => {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  completedWords.forEach((entry, index) => {
    const target = words[index] ?? "";
    const {
      correct: c,
      incorrect: i,
      extra: e,
      missed: m,
    } = compareWord(entry.word, target);

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
  breakdown: CharacterBreakdown,
  durationSeconds: number,
): number => {
  if (durationSeconds <= 0) {
    return 0;
  }

  const totalTyped = breakdown.correct + breakdown.incorrect + breakdown.extra;
  const minutes = durationSeconds / 60;
  return roundTo(totalTyped / BASE_WORD_LENGTH / minutes, 2);
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
  completedWords: CompletedWord[];
  words: string[];
  durationSeconds: number;
  series?: ResultSeriesPoint[];
  currentInput?: string;
  currentTarget?: string;
};

export const calculateResultsMetrics = ({
  completedWords,
  words,
  durationSeconds,
  series = [],
  currentInput,
  currentTarget,
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
  const rawWpm = calculateRawWpm(characters, durationSeconds);
  const accuracy = calculateAccuracy(characters);
  const errors = calculateErrors(characters);
  const consistency = calculateConsistency(series);

  return {
    wpm,
    rawWpm,
    accuracy,
    errors,
    consistency,
    durationSeconds,
    characters,
  };
};
