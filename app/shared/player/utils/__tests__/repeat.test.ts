import { hasNonIntegerValues, adjustRange } from '@/app/shared/player/utils/repeat';

import type { RepeatOptions } from '@/app/shared/player/types';

describe('repeat utilities', () => {
  test('detects non-integer values', () => {
    const opts: RepeatOptions = {
      mode: 'single',
      start: 1,
      end: 2,
      playCount: 1,
      repeatEach: 1,
      delay: 0,
    };
    expect(hasNonIntegerValues(opts)).toBe(false);
    expect(hasNonIntegerValues({ ...opts, start: 1.5 })).toBe(true);
  });

  test('adjustRange enforces valid range', () => {
    const { start, end, adjusted } = adjustRange({ mode: 'range', start: -1, end: 0 });
    expect(start).toBe(1);
    expect(end).toBe(1);
    expect(adjusted).toBe(true);
  });
});
