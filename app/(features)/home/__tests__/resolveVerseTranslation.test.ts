import { resolveVerseTranslation } from '@/app/(features)/home/utils/resolveVerseTranslation';

import type { Verse } from '@/types';

const makeVerse = (translations: Array<{ resource_id: number; text: string }>): Verse =>
  ({
    id: 1,
    verse_key: '1:1',
    text_uthmani: 'بِسْمِ اللَّهِ',
    words: [],
    translations,
  }) as unknown as Verse;

describe('resolveVerseTranslation', () => {
  it('prefers the selected translation when available', () => {
    const verse = makeVerse([
      { resource_id: 20, text: 'English' },
      { resource_id: 161, text: 'Bangla' },
    ]);
    expect(resolveVerseTranslation(verse, 161)).toBe('Bangla');
  });

  it('falls back to translation 20 when preferred is missing', () => {
    const verse = makeVerse([{ resource_id: 20, text: 'English' }]);
    expect(resolveVerseTranslation(verse, 161)).toBe('English');
  });

  it('falls back to the first translation when 20 is missing', () => {
    const verse = makeVerse([{ resource_id: 999, text: 'Other' }]);
    expect(resolveVerseTranslation(verse, 161)).toBe('Other');
  });
});
