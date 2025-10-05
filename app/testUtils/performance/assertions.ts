export function expectUnder(value: number, limit: number): void {
  expect(value).toBeLessThanOrEqual(limit);
}

export function expectAverage(values: number[], limit: number): void {
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  expect(average).toBeLessThanOrEqual(limit);
}
