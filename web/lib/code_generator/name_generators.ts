export const pick = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const uniqueVars = (n: number, gen: () => string) => {
  const set = new Set<string>();
  while (set.size < n) set.add(gen());
  return Array.from(set);
};

// shared word banks
export const varNames = [
  "data",
  "value",
  "item",
  "result",
  "count",
  "temp",
  "user",
];
export const funcNames = [
  "calculate",
  "process",
  "handle",
  "fetchData",
  "compute",
];
export const classNames = ["User", "Product", "Manager", "Service", "Logger"];

// shared generators
export const genVar = () => pick(varNames);
export const genFunc = () => pick(funcNames);
export const genClass = () => pick(classNames);

export const genNumber = () => randInt(1, 100);
