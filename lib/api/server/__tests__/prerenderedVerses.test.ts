import { toPrerenderedVerse } from '@/lib/api/server/prerenderedVerses';

describe('toPrerenderedVerse', () => {
  it('drops U+06DF, which the default Quran font cannot draw (rendered as a dotted circle)', () => {
    const verse = toPrerenderedVerse({
      verse_key: '2:254',
      text_uthmani: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَنفِقُوا۟ مِمَّا',
      translations: [],
    });

    expect(verse.arabic).toBe('يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا أَنفِقُوا مِمَّا');
    expect(verse.arabic).not.toMatch(/۟/);
  });

  it('drops footnote markers from translations', () => {
    const verse = toPrerenderedVerse({
      verse_key: '2:255',
      text_uthmani: 'ٱللَّهُ',
      translations: [{ resource_id: 20, text: 'Allāh<sup foot_note="1">1</sup> - there is' }],
    });

    expect(verse.translations[0]?.html).toBe('Allāh - there is');
  });
});
