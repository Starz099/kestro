import {
  pick,
  randInt,
  uniqueVars,
  genVar,
  genFunc,
  genClass,
  genNumber,
} from "./name_generators";

const templates = [
  `function {{name}}({{params}}): number {
  {{body}}
}`,

  `const {{name}} = ({{params}}): number => {
  {{body}}
};`,

  `for (let i: number = 0; i < {{limit}}; i++) {
  {{body}}
}`,

  `interface {{className}} {
  id: number;
  value: string;
}`,

  `type {{className}} = {
  id: number;
  active: boolean;
};`,

  `const {{var}}: number[] = [{{values}}];`,
];

const genTypedParams = () =>
  uniqueVars(2, genVar)
    .map((v) => `${v}: number`)
    .join(", ");

const genLine = () =>
  pick([
    `return ${genNumber()};`,
    `console.log(${genNumber()});`,
    `const ${genVar()}: number = ${genNumber()};`,
  ]);

const genBody = () =>
  Array.from({ length: randInt(1, 3) })
    .map(() => genLine())
    .join("\n  ");

const fill = (t: string) =>
  t
    .replace(/{{name}}/g, genFunc())
    .replace(/{{className}}/g, genClass())
    .replace(/{{var}}/g, genVar())
    .replace(/{{params}}/g, genTypedParams())
    .replace(/{{limit}}/g, String(randInt(3, 20)))
    .replace(/{{values}}/g, `${genNumber()}, ${genNumber()}, ${genNumber()}`)
    .replace(/{{body}}/g, genBody());

export const generateTypeScriptSnippets = (count: number) =>
  Array.from({ length: count }, () => fill(pick(templates)));
