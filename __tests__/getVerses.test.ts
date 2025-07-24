import { getVersesByChapter, API_BASE_URL } from '@/lib/api';
import { Verse } from '@/types';

describe('getVersesByChapter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requests verses with text_uthmani word field', async () => {
    const mockVerse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'text',
      words: [],
    } as Verse;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ meta: { total_pages: 1 }, verses: [mockVerse] }),
    }) as jest.Mock;

    await getVersesByChapter(1, 20, 1, 1, 'en');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/verses/by_chapter/1?language=en&words=true&word_translation_language=en&word_fields=text_uthmani&translations=20&fields=text_uthmani,audio&per_page=1&page=1`
    );
  });
});
