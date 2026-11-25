jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

jest.mock('@/src/infrastructure/monitoring/Logger', () => ({
  logger: { error: jest.fn() },
}));

import {
  getPrerenderedVersesServer,
  joinWordTransliteration,
  toPrerenderedVerse,
} from '@/lib/api/server/prerenderedVerses';
import { getVersePageVersesServer } from '@/lib/api/server/versePage';

// Shape of a Quran.com response for 112:1 with Saheeh International (20) and
// `words=true&word_fields=transliteration` (other default word fields omitted).
const IKHLAS_1 = {
  id: 6222,
  verse_key: '112:1',
  text_uthmani: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
  translations: [
    {
      resource_id: 20,
      text: 'Say, "He is Allāh, [who is] One,',
      resource_name: 'Saheeh International',
      language_name: 'english',
    },
  ],
  words: [
    { char_type_name: 'word', transliteration: { text: 'qul' } },
    { char_type_name: 'word', transliteration: { text: 'huwa' } },
    { char_type_name: 'word', transliteration: { text: 'l-lahu' } },
    { char_type_name: 'word', transliteration: { text: 'aḥadun' } },
    { char_type_name: 'end', transliteration: { text: null } },
  ],
};

const requestParams = (fetchMock: jest.Mock): URLSearchParams =>
  new URL(String(fetchMock.mock.calls[0]?.[0])).searchParams;

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

  it('joins the word transliterations of a verse with spaces, without the end marker', () => {
    const verse = toPrerenderedVerse(IKHLAS_1);

    expect(verse.transliteration).toBe('qul huwa l-lahu aḥadun');
    expect(verse.translations.map((translation) => translation.resourceId)).toEqual([20]);
  });

  it('has no transliteration when the words were not requested', () => {
    expect(toPrerenderedVerse({ ...IKHLAS_1, words: undefined })).not.toHaveProperty(
      'transliteration'
    );
  });
});

describe('joinWordTransliteration', () => {
  it('skips anything that is not a word, and the end marker even when it has text', () => {
    expect(
      joinWordTransliteration([
        { char_type_name: 'word', transliteration: { text: 'qul' } },
        { char_type_name: 'pause', transliteration: { text: 'x' } },
        { char_type_name: 'word', transliteration: { text: ' huwa ' } },
        { char_type_name: 'end', transliteration: { text: '(1)' } },
      ])
    ).toBe('qul huwa');
  });

  it('gives no partial text when a word lacks its transliteration', () => {
    expect(
      joinWordTransliteration([
        { char_type_name: 'word', transliteration: { text: 'qul' } },
        { char_type_name: 'word', transliteration: null },
      ])
    ).toBeUndefined();
    expect(joinWordTransliteration([{ char_type_name: 'end' }])).toBeUndefined();
    expect(joinWordTransliteration(undefined)).toBeUndefined();
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

describe('transliteration requests', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  const mockApi = (verses: unknown[]): jest.Mock => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({ verses, pagination: { total_pages: 1 } }),
    }));
    global.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
  };

  it('loads the full text without words unless the transliteration is asked for', async () => {
    const fetchMock = mockApi([IKHLAS_1]);

    await getPrerenderedVersesServer({ group: 'by_chapter', id: '2', translationIds: [20] });

    expect(requestParams(fetchMock).get('words')).toBe('false');
    expect(requestParams(fetchMock).get('word_fields')).toBeNull();
  });

  it('asks for the word transliteration in the same full-text request when enabled', async () => {
    const fetchMock = mockApi([IKHLAS_1]);

    const verses = await getPrerenderedVersesServer({
      group: 'by_chapter',
      id: '112',
      translationIds: [20],
      transliteration: true,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requestParams(fetchMock).get('words')).toBe('true');
    expect(requestParams(fetchMock).get('word_fields')).toBe('transliteration');
    expect(requestParams(fetchMock).get('translations')).toBe('20');
    expect(verses?.[0]?.transliteration).toBe('qul huwa l-lahu aḥadun');
  });

  it('gives the verse page its transliteration from the same range request', async () => {
    const fetchMock = mockApi([IKHLAS_1]);

    const { verse } = await getVersePageVersesServer({
      surahId: 112,
      verseKey: '112:1',
      globalVerseId: 6222,
      translationIds: [20],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requestParams(fetchMock).get('words')).toBe('true');
    expect(requestParams(fetchMock).get('word_fields')).toBe('transliteration');
    expect(verse.transliteration).toBe('qul huwa l-lahu aḥadun');
    expect(verse.translations).toEqual([
      expect.objectContaining({ resourceId: 20, resourceName: 'Saheeh International' }),
    ]);
  });

  it('still loads the transliteration on a verse page without translations (Arabic UI)', async () => {
    const fetchMock = mockApi([{ ...IKHLAS_1, translations: [] }]);

    const { verse } = await getVersePageVersesServer({
      surahId: 112,
      verseKey: '112:1',
      globalVerseId: 6222,
      translationIds: [],
    });

    expect(requestParams(fetchMock).get('translations')).toBeNull();
    expect(verse).toMatchObject({ translations: [], transliteration: 'qul huwa l-lahu aḥadun' });
  });
});
