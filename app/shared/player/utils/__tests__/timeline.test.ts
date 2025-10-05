import { formatTime } from '@/app/shared/player/utils/timeline';

describe('formatTime', () => {
  test('formats seconds into mm:ss', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
  });
});
