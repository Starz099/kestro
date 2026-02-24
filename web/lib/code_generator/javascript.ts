import {
  pick,
  randInt,
  uniqueVars,
  genVar,
  genFunc,
  genClass,
  genNumber,
} from "./name_generators";

// ---------- templates ----------
const templates = [
  `function {{name}}({{params}}) {\n  {{body}}\n}`,

  `const {{name}} = ({{params}}) => {\n  {{body}}\n};`,

  `for (let i = 0; i < {{limit}}; i++) {\n  {{body}}\n}`,

  `if ({{condition}}) {\n  {{body}}\n} else {\n  {{body}}\n}`,

  `const {{var}} = [{{values}}];`,

  `const {{var}} = {{expression}};`,

  `class {{className}} {\n  constructor({{params}}) {\n    {{body}}\n  }\n}`,

  // functional JS
  `const {{var}} = {{array}}.map(x => x * {{num}});`,

  `const {{var}} = {{array}}.filter(x => x > {{num}});`,

  `const {{var}} = {{array}}.reduce((acc, x) => acc + x, 0);`,

  // object & destructuring
  `const {{var}} = { id: {{num}}, name: "item" + {{num}} };`,

  `const { {{var}} } = {{obj}};`,

  // optional chaining
  `const {{var}} = {{obj}}?.{{prop}} ?? {{num}};`,

  // async promise chain
  `fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data));`,

  // push loop
  `const {{array}} = [];
for (let i = 0; i < {{limit}}; i++) {
  {{array}}.push(i);
}`,

  // nested if
  `if ({{condition}}) {
  if ({{condition}}) {
    {{body}}
  }
}`,
];

// ---------- small generators ----------
const genMathExpr = () => {
  const a = pick([genVar(), genNumber().toString()]);
  const b = pick([genVar(), genNumber().toString()]);
  const op = pick(["+", "-", "*", "/"]);
  return `${a} ${op} ${b}`;
};

const genCondition = () => {
  const a = pick([genVar(), genNumber().toString()]);
  const op = pick([">", "<", "===", "!=="]);
  return `${a} ${op} ${genNumber()}`;
};

const genLine = () =>
  pick([
    `return ${pick([genVar(), genNumber(), `"text"`])};`,
    `console.log(${pick([genVar(), genNumber(), `"log"`])});`,
    `const ${genVar()} = ${genNumber()};`,
  ]);

const genBody = () => {
  const lines = randInt(1, 3);
  return Array.from({ length: lines })
    .map(() => genLine())
    .join("\n  ");
};

// ---------- filler ----------
const fill = (t: string) =>
  t
    .replace(/{{name}}/g, genFunc())
    .replace(/{{className}}/g, genClass())
    .replace(/{{var}}/g, genVar())
    .replace(/{{params}}/g, uniqueVars(2, genVar).join(", "))
    .replace(/{{limit}}/g, String(randInt(3, 20)))
    .replace(/{{values}}/g, `${genNumber()}, ${genNumber()}, ${genNumber()}`)
    .replace(/{{body}}/g, genBody())
    .replace(/{{expression}}/g, genMathExpr())
    .replace(/{{condition}}/g, genCondition())
    .replace(/{{array}}/g, genVar())
    .replace(/{{obj}}/g, genVar())
    .replace(/{{prop}}/g, genVar())
    .replace(/{{num}}/g, genNumber().toString());

// ---------- export ----------
export const generateJsSnippets = (count: number) =>
  Array.from({ length: count }, () => fill(pick(templates)));
