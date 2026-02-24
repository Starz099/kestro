// Shared filter options used across the application
export const editor = ["text", "vscode"] as const;
export const languages = ["english", "javascript", "cpp"] as const;

export const codingLanguages: Language[] = ["javascript", "cpp"] as const;

export type ActivityType = "TEXT" | "CODE";

export const getActivityType = (language: Language): ActivityType => {
  return codingLanguages.includes(language) ? "CODE" : "TEXT";
};

export const getAllowedEditorModes = (
  language: Language,
): readonly EditorMode[] => {
  if (language === "english") {
    return ["text"] as const;
  }
  if (codingLanguages.includes(language)) {
    return ["vscode"] as const;
  }
  return editor;
};

export const getAllowedModes = (language: Language): readonly Mode[] => {
  if (language === "english") {
    return ["timer", "words"] as const;
  }
  if (codingLanguages.includes(language)) {
    return ["timer", "snippets"] as const;
  }
  return modes;
};

export const fontSizes = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36] as const;
export const timers = [15, 30, 60, 120] as const;
export const modes = ["timer", "words", "snippets"] as const;
export const wordCounts = [10, 25, 50, 100] as const;
export const snippetCounts = [1, 2, 5, 10, 20] as const;

// Type exports for TypeScript
export type EditorMode = (typeof editor)[number];
export type Language = (typeof languages)[number];
export type FontSize = (typeof fontSizes)[number];
export type Timer = (typeof timers)[number];
export type Mode = (typeof modes)[number];
export type WordCount = (typeof wordCounts)[number];
export type SnippetCount = (typeof snippetCounts)[number];

// Filter preferences interface
export interface FilterPreferences {
  editorMode: EditorMode;
  language: Language;
  fontSize: FontSize;
  timer: Timer;
  mode: Mode;
  wordCount: WordCount;
  snippetCount?: SnippetCount;
  soundEnabled: boolean;
}

// Default filter preferences
export const defaultFilterPreferences: FilterPreferences = {
  editorMode: "text",
  language: "english",
  fontSize: 32,
  timer: 30,
  mode: "timer",
  wordCount: 25,
  snippetCount: 5,
  soundEnabled: true,
};
