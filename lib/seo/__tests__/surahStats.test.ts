import { buildSurahWordStats, splitDuration } from '@/lib/seo/surahStats';

describe('buildSurahWordStats', () => {
  it('totals words and finds the longest and shortest verse of Al-Fatihah', () => {
    expect(buildSurahWordStats(1)).toMatchObject({
      totalWords: 29,
      longest: { verse: 7, words: 9, others: 0 },
      shortest: { verse: 3, words: 2, others: 0 },
    });
  });

  it('points to the first of several equally short verses and counts the rest', () => {
    const baqarah = buildSurahWordStats(2)!;
    expect(baqarah.longest).toEqual({ verse: 282, words: 128, others: 0 });
    expect(baqarah.shortest.verse).toBe(1);
    expect(baqarah.shortest.words).toBe(1);
    expect(baqarah.perVerse).toHaveLength(286);
  });

  it('returns null for a surah that does not exist', () => {
    expect(buildSurahWordStats(115)).toBeNull();
  });
});

describe('splitDuration', () => {
  it('rounds to whole seconds', () => {
    expect(splitDuration(104000)).toEqual({ minutes: 1, seconds: 44 });
    expect(splitDuration(59600)).toEqual({ minutes: 1, seconds: 0 });
    expect(splitDuration(-5)).toEqual({ minutes: 0, seconds: 0 });
  });
});
