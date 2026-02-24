import { generateJsSnippets } from "./javascript";
import { generateCppSnippets } from "./c_plus_plus";

export type Language = "javascript" | "cpp";

export function generateSnippets(language: Language, count: number) {
  switch (language) {
    case "javascript":
      return generateJsSnippets(count);
    case "cpp":
      return generateCppSnippets(count);
    default:
      return [];
  }
}
