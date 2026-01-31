import { getSurahInitialDataServer } from '@/lib/api/server/surah';

import type { Verse } from '@/types';

jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

jest.mock('../chapters', () => ({
  getChapterServer: jest.fn(),
}));

jest.mock('@/lib/api/verses/fetchers', () => ({
  getVersesByChapter: jest.fn(),
}));

jest.mock('@/src/infrastructure/monitoring/Logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('getSurahInitialDataServer', () => {
  it('returns total verses + initial verses', async () => {
    const { getChapterServer } = jest.requireMock('../chapters') as {
      getChapterServer: jest.Mock;
    };
    const { getVersesByChapter } = jest.requireMock('@/lib/api/verses/fetchers') as {
      getVersesByChapter: jest.Mock;
    };

    getChapterServer.mockResolvedValue({ id: 2, verses_count: 286 });

    const verse: Verse = {
      id: 1,
      verse_key: '2:1',
      text_uthmani: 'الم',
      words: [],
    };
    getVersesByChapter.mockResolvedValue({ verses: [verse], totalPages: 15 });

    const result = await getSurahInitialDataServer({
      surahId: '2',
      translationIds: [20],
      wordLang: 'en',
      perPage: 20,
    });

    expect(getChapterServer).toHaveBeenCalledWith(2);
    expect(getVersesByChapter).toHaveBeenCalledWith({
      id: '2',
      translationIds: [20],
      page: 1,
      perPage: 20,
      wordLang: 'en',
    });
    expect(result).toEqual({ totalVerses: 286, initialVerses: [verse] });
  });

  it('does not throw when initial verse fetch fails', async () => {
    const { getChapterServer } = jest.requireMock('../chapters') as {
      getChapterServer: jest.Mock;
    };
    const { getVersesByChapter } = jest.requireMock('@/lib/api/verses/fetchers') as {
      getVersesByChapter: jest.Mock;
    };
    const { logger } = jest.requireMock('@/src/infrastructure/monitoring/Logger') as {
      logger: { error: jest.Mock };
    };

    getChapterServer.mockResolvedValue({ id: 2, verses_count: 286 });
    getVersesByChapter.mockRejectedValue(new Error('Nope'));

    const result = await getSurahInitialDataServer({
      surahId: '2',
      translationIds: [20],
      wordLang: 'en',
      perPage: 20,
    });

    expect(result.totalVerses).toBe(286);
    expect(result.initialVerses).toBeUndefined();
    expect(logger.error).toHaveBeenCalled();
  });
});

