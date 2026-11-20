import {
  getNextVerse,
  getPreviousVerse,
  parseVerseAddress,
} from '@/app/shared/navigation/verseNavigation';

// Real counts for the surahs used here; 2..113 only need to exist.
const verseCounts = Array.from({ length: 114 }, (_, index) =>
  index === 0 ? 7 : index === 1 ? 286 : index === 113 ? 6 : 10
);

describe('verse addressing', () => {
  it.each([
    ['1', '1', { surahId: 1, verseId: 1 }],
    ['2', '286', { surahId: 2, verseId: 286 }],
    ['114', '6', { surahId: 114, verseId: 6 }],
  ])('accepts %s:%s', (surah, verse, expected) => {
    expect(parseVerseAddress(surah, verse, verseCounts)).toEqual(expected);
  });

  it.each([
    ['2', '287'], // past the chapter's verses_count
    ['2', '0'],
    ['0', '1'],
    ['115', '1'], // no such surah
    ['2', 'abc'],
    ['2', '-1'],
    ['02', '255'], // non-canonical numbers would duplicate pages
    ['2', '255.0'],
    ['2', '1e2'],
  ])('rejects %s:%s', (surah, verse) => {
    expect(parseVerseAddress(surah, verse, verseCounts)).toBeNull();
  });

  it('crosses surah boundaries for previous and next', () => {
    expect(getNextVerse({ surahId: 1, verseId: 7 }, verseCounts)).toEqual({
      surahId: 2,
      verseId: 1,
    });
    expect(getPreviousVerse({ surahId: 2, verseId: 1 }, verseCounts)).toEqual({
      surahId: 1,
      verseId: 7,
    });
    expect(getNextVerse({ surahId: 2, verseId: 255 }, verseCounts)).toEqual({
      surahId: 2,
      verseId: 256,
    });
  });

  it('has no previous before 1:1 and no next after 114:6', () => {
    expect(getPreviousVerse({ surahId: 1, verseId: 1 }, verseCounts)).toBeNull();
    expect(getNextVerse({ surahId: 114, verseId: 6 }, verseCounts)).toBeNull();
  });
});
