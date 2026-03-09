import { generateJsSnippets } from "./javascript";
import { generateCppSnippets } from "./c_plus_plus";
import { generatePythonSnippets } from "./python";
import { generateRustSnippets } from "./rust";
import { generateTypeScriptSnippets } from "./typescript";
import { generateJavaSnippets } from "./java";

export type Language =
  | "javascript"
  | "cpp"
  | "python"
  | "rust"
  | "typescript"
  | "java";

const generators = {
  javascript: generateJsSnippets,
  cpp: generateCppSnippets,
  python: generatePythonSnippets,
  rust: generateRustSnippets,
  typescript: generateTypeScriptSnippets,
  java: generateJavaSnippets,
};

export function generateSnippets(language: Language, count: number) {
  return generators[language]?.(count) ?? [];
}
