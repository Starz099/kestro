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
  `int {{name}}({{params}}) {\n    {{body}}\n}`,

  `for (int i = 0; i < {{limit}}; i++) {\n    {{body}}\n}`,

  `if ({{condition}}) {\n    {{body}}\n} else {\n    {{body}}\n}`,

  `vector<int> {{var}} = { {{values}} };`,

  `int {{var}} = {{expression}};`,

  `class {{className}} {\npublic:\n    {{className}}({{params}}) {\n        {{body}}\n    }\n};`,

  `while ({{condition}}) {\n    {{body}}\n}`,

  // vector iteration
  `vector<int> {{var}} = { {{values}} };
for (int x : {{var}}) {
    {{body}}
}`,

  // sum loop
  `int sum = 0;
for (int i = 0; i < {{limit}}; i++) {
    sum += i;
}`,

  // function with loop
  `int {{name}}(int n) {
    int res = 0;
    for (int i = 0; i < n; i++) {
        res += i;
    }
    return res;
}`,

  // nested if
  `if ({{condition}}) {
    if ({{condition}}) {
        {{body}}
    }
}`,

  // swap
  `int a = {{num}}, b = {{num}};
swap(a, b);`,

  // max
  `int {{var}} = max({{num}}, {{num}});`,

  // decrement loop
  `int {{var}} = {{num}};
while ({{var}} > 0) {
    {{var}}--;
}`,

  // struct
  `struct {{className}} {
    int value;
};`,
];

// ---------- generators ----------
const genMathExpr = () => {
  const a = pick([genVar(), genNumber().toString()]);
  const b = pick([genVar(), genNumber().toString()]);
  const op = pick(["+", "-", "*", "/"]);
  return `${a} ${op} ${b}`;
};

const genCondition = () => {
  const a = pick([genVar(), genNumber().toString()]);
  const op = pick([">", "<", "==", "!="]);
  return `${a} ${op} ${genNumber()}`;
};

const genLine = () =>
  pick([
    `return ${pick([genVar(), genNumber()])};`,
    `cout << ${pick([genVar(), genNumber()])} << endl;`,
    `int ${genVar()} = ${genNumber()};`,
  ]);

const genBody = () => {
  const lines = randInt(1, 3);
  return Array.from({ length: lines })
    .map(() => genLine())
    .join("\n    ");
};

// ---------- filler ----------
const fill = (t: string) =>
  t
    .replace(/{{name}}/g, genFunc())
    .replace(/{{className}}/g, genClass())
    .replace(/{{var}}/g, genVar())
    .replace(
      /{{params}}/g,
      uniqueVars(2, genVar)
        .map((v) => `int ${v}`)
        .join(", "),
    )
    .replace(/{{limit}}/g, String(randInt(3, 20)))
    .replace(/{{values}}/g, `${genNumber()}, ${genNumber()}, ${genNumber()}`)
    .replace(/{{body}}/g, genBody())
    .replace(/{{expression}}/g, genMathExpr())
    .replace(/{{condition}}/g, genCondition())
    .replace(/{{num}}/g, genNumber().toString());

// ---------- export ----------
export const generateCppSnippets = (count: number) =>
  Array.from({ length: count }, () => fill(pick(templates)));
