// ---------- helpers ----------
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const uniqueVars = (n: number) => {
  const set = new Set<string>();
  while (set.size < n) set.add(genVar());
  return Array.from(set);
};

// ---------- name banks ----------
const varNames = ["data", "value", "item", "result", "count", "temp", "user"];
const funcNames = ["calculate", "process", "handle", "fetchData", "compute"];
const classNames = ["User", "Product", "Manager", "Service", "Logger"];

// ---------- templates ----------
export const snippetTemplates: string[] = [
  `function {{name}}({{params}}) {\n  {{body}}\n}`,
  `const {{name}} = ({{params}}) => {\n  {{body}}\n};`,
  `for (let i = 0; i < {{limit}}; i++) {\n  {{body}}\n}`,
  `if ({{condition}}) {\n  {{body}}\n} else {\n  {{body}}\n}`,
  `const {{var}} = [{{values}}];`,
  `const {{var}} = {{expression}};`,
  `async function {{name}}({{param}}) {\n  const res = await fetch({{param}});\n  return res.json();\n}`,
  `class {{className}} {\n  constructor({{params}}) {\n    {{body}}\n  }\n}`,
];

// ---------- generators ----------
export const genVar = () => pick(varNames);
export const genFunc = () => pick(funcNames);
export const genClass = () => pick(classNames);

export const genNumber = () => randInt(1, 100);

export const genString = () =>
  `'${pick(["hello", "world", "test", "demo", "sample"])}'`;

export const genBool = () => pick(["true", "false"]);

// safer math expressions (mix of vars + numbers)
export const genMathExpr = () => {
  const a = pick([genVar(), String(genNumber())]);
  const b = pick([genVar(), String(genNumber())]);
  const op = pick(["+", "-", "*", "/"]);
  return `${a} ${op} ${b}`;
};

export const genCondition = () => {
  const a = pick([genVar(), String(genNumber())]);
  const op = pick([">", "<", "===", "!=="]);
  return `${a} ${op} ${genNumber()}`;
};

export const genReturn = () =>
  `return ${pick([genVar(), genNumber(), genString()])};`;

export const genConsole = () =>
  `console.log(${pick([genVar(), genNumber(), genString()])});`;

// multi-line body generator (1–3 lines)
export const genBody = () => {
  const lines = randInt(1, 3);

  return Array.from({ length: lines })
    .map(() =>
      pick([genReturn(), genConsole(), `const ${genVar()} = ${genNumber()};`]),
    )
    .join("\n  ");
};

// ---------- template filler ----------
export function fillTemplate(template: string): string {
  return template
    .replace(/{{name}}/g, genFunc())
    .replace(/{{className}}/g, genClass())
    .replace(/{{var}}/g, genVar())
    .replace(/{{param}}/g, genVar())
    .replace(/{{params}}/g, uniqueVars(2).join(", "))
    .replace(/{{limit}}/g, String(randInt(3, 20)))
    .replace(/{{values}}/g, `${genNumber()}, ${genNumber()}, ${genNumber()}`)
    .replace(/{{body}}/g, genBody())
    .replace(/{{expression}}/g, genMathExpr())
    .replace(/{{condition}}/g, genCondition());
}

// ---------- final generator ----------
export function generateCodeSnippets(count: number): string[] {
  const snippets: string[] = [];

  for (let i = 0; i < count; i++) {
    const template = pick(snippetTemplates);
    snippets.push(fillTemplate(template));
  }

  return snippets;
}
