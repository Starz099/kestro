// Shared filter options used across the application
export const editor = ["text", "vscode", "vim"] as const;
export const languages = ["english", "c++", "python", "javascript"] as const;
export const fontSizes = [12, 14, 16, 18, 20, 22, 24] as const;
export const timers = [15, 30, 60, 120] as const;
export const modes = ["timer", "words", "zen"] as const;
export const wordCounts = [10, 25, 50, 100] as const;

// Type exports for TypeScript
export type EditorMode = (typeof editor)[number];
export type Language = (typeof languages)[number];
export type FontSize = (typeof fontSizes)[number];
export type Timer = (typeof timers)[number];
export type Mode = (typeof modes)[number];
export type WordCount = (typeof wordCounts)[number];

// Filter preferences interface
export interface FilterPreferences {
  editorMode: EditorMode;
  language: Language;
  fontSize: FontSize;
  timer: Timer;
  mode: Mode;
  wordCount: WordCount;
  soundEnabled: boolean;
}

// Default filter preferences
export const defaultFilterPreferences: FilterPreferences = {
  editorMode: "text",
  language: "english",
  fontSize: 16,
  timer: 30,
  mode: "timer",
  wordCount: 25,
  soundEnabled: true,
};
