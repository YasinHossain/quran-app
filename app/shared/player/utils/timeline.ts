export function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const minutes = Math.floor(s / 60);
  const secs = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
}
