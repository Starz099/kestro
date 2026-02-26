import { generateJsSnippets } from "./javascript";
import { generateCppSnippets } from "./c_plus_plus";
import { generatePythonSnippets } from "./python";
import { generateRustSnippets } from "./rust";
import { generateTypeScriptSnippets } from "./typescript";

export type Language = "javascript" | "cpp" | "python" | "rust" | "typescript";

const generators = {
  javascript: generateJsSnippets,
  cpp: generateCppSnippets,
  python: generatePythonSnippets,
  rust: generateRustSnippets,
  typescript: generateTypeScriptSnippets,
};

export function generateSnippets(language: Language, count: number) {
  return generators[language]?.(count) ?? [];
}
