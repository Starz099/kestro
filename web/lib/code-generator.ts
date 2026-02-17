export const codeSnippetBank: string[] = [
  `function add(a, b) { return a + b; }`,
  `const greet = (name) => \`Hello, \${name}!\`;`,
  `for (let i = 0; i < 10; i++) { console.log(i); }`,
  `if (x > 0) { console.log('Positive'); } else { console.log('Non-positive'); }`,
  `class Person { constructor(name) { this.name = name; } greet() { return \`Hi, I'm \${this.name}\`; } }`,
  `try { riskyOperation(); } catch (error) { console.error(error); }`,
  `const numbers = [1, 2, 3, 4, 5]; const squares = numbers.map(n => n * n);`,
  `async function fetchData(url) { const response = await fetch(url); return response.json(); }`,
  `const isEven = (num) => num % 2 === 0;`,
  `const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);`,
  `const x = 10;`,
  `const arr = [1, 2, 3];`,
  `const obj = { name: 'John', age: 30 };`,
  `console.log('Hello');`,
  `const sum = a + b;`,
  `const exists = array.includes(5);`,
  `const name = person?.name ?? 'Unknown';`,
] as const;

export function generateCodeSnippets(count: number): string[] {
  const shuffled = [...codeSnippetBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
