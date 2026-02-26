import type { CompletedSnippet } from "./coding";

export type CompletedWord = {
  word: string;
  isCorrect: boolean;
};

export type { CompletedSnippet } from "./coding";

export type CompletedItem = CompletedWord | CompletedSnippet;
