export function formatStarCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) {
    return "0";
  }

  if (count < 1000) {
    return count.toString();
  }

  const units = [
    { value: 1_000_000_000, suffix: "B" },
    { value: 1_000_000, suffix: "M" },
    { value: 1_000, suffix: "k" },
  ];

  for (const unit of units) {
    if (count >= unit.value) {
      const value = count / unit.value;
      const rounded =
        value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
      const text = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
      return `${text}${unit.suffix}`;
    }
  }

  return count.toString();
}
