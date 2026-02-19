export const codeSnippetBank: string[] = [
  `function add(a, b) {\n\treturn a + b;\n}`,
  `const greet = (name) => {\n\treturn \`Hello, \${name}!\`;\n};`,
  `for (let i = 0; i < 10; i++) {\n\tconsole.log(i);\n}`,
  `if (x > 0) {\n\tconsole.log('Positive');\n} else {\n\tconsole.log('Non-positive');\n}`,
  `class Person {\n\tconstructor(name) {\n\t\tthis.name = name;\n\t}\n\tgreet() {\n\t\treturn \`Hi, I'm \${this.name}\`;\n\t}\n}`,
  `try {\n\triskyOperation();\n} catch (error) {\n\tconsole.error(error);\n}`,
  `const numbers = [1, 2, 3, 4, 5];\nconst squares = numbers.map(n => n * n);`,
  `async function fetchData(url) {\n\tconst response = await fetch(url);\n\treturn response.json();\n}`,
  `const isEven = (num) => num % 2 === 0;`,
  `const factorial = (n) => {\n\treturn n <= 1 ? 1 : n * factorial(n - 1);\n};`,
  `const x = 10;`,
  `const arr = [1, 2, 3];`,
  `const obj = {\n\tname: 'John',\n\tage: 30\n};`,
  `console.log('Hello');`,
  `const sum = a + b;`,
  `const exists = array.includes(5);`,
  `const name = person?.name ?? 'Unknown';`,
  `const unique = [...new Set(array)];`,
  `const filtered = items.filter(item => item.active);`,
  `const sorted = [...items].sort((a, b) => a.id - b.id);`,
] as const;

export function generateCodeSnippets(count: number): string[] {
  const snippets: string[] = [];
  const shuffledBank = [...codeSnippetBank].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    snippets.push(shuffledBank[i % shuffledBank.length]);
  }
  return snippets;
}
