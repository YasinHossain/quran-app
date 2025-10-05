import { parseVerseKey } from '@/lib/utils/verse';

describe('parseVerseKey', () => {
  it('parses valid verse key', () => {
    expect(parseVerseKey('2:255')).toEqual({ surahNumber: 2, ayahNumber: 255 });
  });

  it('returns zeros for missing key', () => {
    expect(parseVerseKey(undefined)).toEqual({ surahNumber: 0, ayahNumber: 0 });
  });

  it('handles invalid format', () => {
    expect(parseVerseKey('abc')).toEqual({ surahNumber: 0, ayahNumber: 0 });
  });
});
