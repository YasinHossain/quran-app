import { getVersesByChapter, getVersesByJuz, getVersesByPage } from '@/lib/api/verses';
import { API_BASE_URL } from '@/lib/api';
import { Verse } from '@/types';

describe('getVersesByChapter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('delegates to fetchVerses with chapter endpoint', async () => {
    const mockVerse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [],
    } as Verse;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ pagination: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByChapter(1, 20, 1, 1, 'tr');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/by_chapter/1?language=tr&words=true&word_translation_language=tr&word_fields=text_uthmani&translations=20&fields=text_uthmani,audio&per_page=1&page=1`
    );
  });
});

describe('getVersesByJuz', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('delegates to fetchVerses with juz endpoint', async () => {
    const mockVerse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [],
    } as Verse;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ pagination: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByJuz(1, 20, 1, 1, 'en');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/by_juz/1?language=en&words=true&word_translation_language=en&word_fields=text_uthmani&translations=20&fields=text_uthmani,audio&per_page=1&page=1`
    );
  });
});

describe('getVersesByPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('delegates to fetchVerses with page endpoint', async () => {
    const mockVerse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [],
    } as Verse;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ pagination: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByPage(1, 20, 1, 1, 'en');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/by_page/1?language=en&words=true&word_translation_language=en&word_fields=text_uthmani&translations=20&fields=text_uthmani,audio&per_page=1&page=1`
    );
  });
});
