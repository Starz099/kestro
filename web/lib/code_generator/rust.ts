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
  `fn {{name}}({{params}}) -> i32 {
    {{body}}
}`,

  `for i in 0..{{limit}} {
    {{body}}
}`,

  `if {{condition}} {
    {{body}}
} else {
    {{body}}
}`,

  `let {{var}} = vec![{{values}}];`,

  `struct {{className}} {
    value: i32,
}`,

  `while {{condition}} {
    {{body}}
}`,
];

const genCondition = () =>
  `${pick([genVar(), genNumber().toString()])} ${pick([">", "<", "==", "!="])} ${genNumber()}`;

const genTypedParams = () =>
  uniqueVars(2, genVar)
    .map((v) => `${v}: i32`)
    .join(", ");

const genLine = () =>
  pick([
    `return ${genNumber()};`,
    `println!("{}", ${genNumber()});`,
    `let ${genVar()} = ${genNumber()};`,
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
    .replace(/{{params}}/g, genTypedParams())
    .replace(/{{limit}}/g, String(randInt(3, 20)))
    .replace(/{{values}}/g, `${genNumber()}, ${genNumber()}, ${genNumber()}`)
    .replace(/{{body}}/g, genBody())
    .replace(/{{condition}}/g, genCondition());

export const generateRustSnippets = (count: number) =>
  Array.from({ length: count }, () => fill(pick(templates)));
