jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

jest.mock('@/src/infrastructure/monitoring/Logger', () => ({
  logger: { error: jest.fn() },
}));

import { getPrerenderedVersesServer, toPrerenderedVerse } from '@/lib/api/server/prerenderedVerses';

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

const makeVerses = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    verse_key: `78:${index + 1}`,
    text_uthmani: `arabic ${index + 1}`,
    translations: [{ resource_id: 20, text: `translation ${index + 1}<sup>1</sup>` }],
  }));

describe('getPrerenderedVersesServer', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetches a whole 564-verse juz in a single upstream request', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({ verses: makeVerses(564), pagination: { total_pages: 1 } }),
    }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const verses = await getPrerenderedVersesServer({
      group: 'by_juz',
      id: '30',
      translationIds: [20],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(verses).toHaveLength(564);
    expect(verses?.[0]).toMatchObject({ verseKey: '78:1', arabic: 'arabic 1' });
    expect(verses?.[563]?.translations[0]?.html).toBe('translation 564');
  });

  it('still follows pagination when the API clamps per_page', async () => {
    const fetchMock = jest.fn(async (url: string) => {
      const page = Number(new URL(url).searchParams.get('page'));
      return {
        ok: true,
        json: async () => ({
          verses: makeVerses(page === 1 ? 50 : 20),
          pagination: { total_pages: 2 },
        }),
      };
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const verses = await getPrerenderedVersesServer({
      group: 'by_juz',
      id: '30',
      translationIds: [20],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(verses).toHaveLength(70);
  });
});
