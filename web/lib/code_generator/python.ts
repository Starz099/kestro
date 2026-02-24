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
  `def {{name}}({{params}}):
    {{body}}`,

  `for i in range({{limit}}):
    {{body}}`,

  `if {{condition}}:
    {{body}}
else:
    {{body}}`,

  `{{var}} = [{{values}}]`,

  `class {{className}}:
    def __init__(self, {{params}}):
        {{body}}`,

  `while {{condition}}:
    {{body}}`,
];

const genCondition = () =>
  `${pick([genVar(), genNumber().toString()])} ${pick([">", "<", "==", "!="])} ${genNumber()}`;

const genLine = () =>
  pick([
    `return ${pick([genVar(), genNumber()])}`,
    `print(${pick([genVar(), genNumber()])})`,
    `${genVar()} = ${genNumber()}`,
  ]);

const genBody = () =>
  Array.from({ length: randInt(1, 3) })
    .map(() => genLine())
    .join("\n    ");

const fill = (t: string) =>
  t
    .replace(/{{name}}/g, genFunc())
    .replace(/{{className}}/g, genClass())
    .replace(/{{var}}/g, genVar())
    .replace(/{{params}}/g, uniqueVars(2, genVar).join(", "))
    .replace(/{{limit}}/g, String(randInt(3, 20)))
    .replace(/{{values}}/g, `${genNumber()}, ${genNumber()}, ${genNumber()}`)
    .replace(/{{body}}/g, genBody())
    .replace(/{{condition}}/g, genCondition());

export const generatePythonSnippets = (count: number) =>
  Array.from({ length: count }, () => fill(pick(templates)));
