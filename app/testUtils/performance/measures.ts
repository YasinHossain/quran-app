export async function measureRendering(action: () => void | Promise<void>): Promise<number> {
  const start = performance.now();
  await action();
  const end = performance.now();
  return end - start;
}

export async function measureInteractions(
  interaction: () => void | Promise<void>,
  count = 1
): Promise<number[]> {
  const durations: number[] = [];
  for (let i = 0; i < count; i++) {
    const start = performance.now();
    await interaction();
    const end = performance.now();
    durations.push(end - start);
  }
  return durations;
}
