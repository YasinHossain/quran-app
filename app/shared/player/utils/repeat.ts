import type { RepeatOptions } from '@/app/shared/player/types';

export function hasNonIntegerValues(opts: RepeatOptions): boolean {
  const numericKeys: (keyof RepeatOptions)[] = ['start', 'end', 'playCount', 'repeatEach', 'delay'];
  return numericKeys.some((key) => {
    const val = opts[key];
    return val !== undefined && !Number.isInteger(val);
  });
}

export function adjustRange(opts: RepeatOptions): {
  start: number;
  end: number;
  adjusted: boolean;
} {
  const start = Math.max(1, opts.start ?? 1);
  const end = Math.max(start, opts.end ?? start);
  return { start, end, adjusted: start !== opts.start || end !== opts.end };
}
