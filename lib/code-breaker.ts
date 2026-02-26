/**
 * Utility to "break" code snippets for the "fix the code" mode.
 * It introduces intentional errors or missing parts.
 */
export const breakCode = (code: string): string => {
  const lines = code.split("\n");
  const brokenLines = lines.map((line) => {
    // Only break lines that have actual code (not just whitespace or comments)
    if (
      line.trim().length < 3 ||
      line.trim().startsWith("//") ||
      line.trim().startsWith("/*")
    ) {
      return line;
    }

    let brokenLine = line;

    // 1. Randomly remove some common syntax characters
    const syntaxChars = [";", "(", ")", "{", "}", "[", "]", ",", ":"];
    if (Math.random() > 0.6) {
      const charToHide =
        syntaxChars[Math.floor(Math.random() * syntaxChars.length)];
      if (brokenLine.includes(charToHide)) {
        // Only replace one occurrence to keep it solvable
        brokenLine = brokenLine.replace(charToHide, " ");
      }
    }

    // 2. Randomly replace some operators or keywords
    const replacements: Record<string, string> = {
      "==": "=",
      "===": "==",
      const: "let",
      let: "var",
      true: "false",
      false: "true",
      import: "require",
      export: "module.exports",
      "=>": ">",
      "+": "-",
      "-": "+",
    };

    for (const [key, value] of Object.entries(replacements)) {
      if (brokenLine.includes(key) && Math.random() > 0.8) {
        brokenLine = brokenLine.replace(key, value);
        break; // Only one logical replacement per line
      }
    }

    // 3. Randomly delete a small word (3-5 chars)
    if (Math.random() > 0.8) {
      const words = brokenLine.split(/(\s+)/);
      const codeWords = words.filter(
        (w) => w.trim().length >= 3 && w.trim().length <= 6,
      );
      if (codeWords.length > 0) {
        const wordToHide =
          codeWords[Math.floor(Math.random() * codeWords.length)];
        brokenLine = brokenLine.replace(
          wordToHide,
          " ".repeat(wordToHide.length),
        );
      }
    }

    return brokenLine;
  });

  // If the code wasn't broken at all, force at least one break
  let result = brokenLines.join("\n");
  if (result === code && code.length > 5) {
    // Force remove the last semicolon or something
    if (code.includes(";")) {
      const lastIndex = result.lastIndexOf(";");
      result =
        result.substring(0, lastIndex) + " " + result.substring(lastIndex + 1);
    } else if (code.includes("(")) {
      const lastIndex = result.lastIndexOf("(");
      result =
        result.substring(0, lastIndex) + " " + result.substring(lastIndex + 1);
    }
  }

  return result;
};
