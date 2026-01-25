import { getTafsirVersePageDataServer } from '@/lib/api/server/tafsir';

import type { Verse } from '@/types';

jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
}));

jest.mock('@/lib/api/verses', () => ({
  getVerseByKey: jest.fn(),
}));

jest.mock('@/src/infrastructure/di/Container', () => ({
  container: {
    getTafsirRepository: jest.fn(),
  },
}));

jest.mock('@/src/application/use-cases/GetTafsirContent', () => ({
  GetTafsirContentUseCase: class {
    execute = jest.fn(async () => '<p>tafsir</p>');
  },
}));

jest.mock('@/src/application/use-cases/GetTafsirResources', () => ({
  GetTafsirResourcesUseCase: class {
    execute = jest.fn(async () => ({
      tafsirs: [{ id: 169, displayName: 'Mock Tafsir', language: 'en' }],
      isFromCache: false,
    }));
  },
}));

describe('getTafsirVersePageDataServer', () => {
  it('returns verse + tafsir HTML and resource metadata', async () => {
    const { getVerseByKey } = jest.requireMock('@/lib/api/verses') as {
      getVerseByKey: jest.Mock;
    };

    const verse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'بِسْمِ ٱللَّٰهِ',
      words: [],
      translations: [{ resource_id: 20, text: 'In the name of Allah' }],
    };
    getVerseByKey.mockResolvedValue(verse);

    const result = await getTafsirVersePageDataServer({
      verseKey: '1:1',
      tafsirId: 169,
      translationIds: [20],
      wordLang: 'en',
      tajweed: false,
    });

    expect(result.verse).toEqual(verse);
    expect(result.tafsirHtml).toBe('<p>tafsir</p>');
    expect(result.tafsirResource).toEqual({ id: 169, name: 'Mock Tafsir', lang: 'en' });
  });
});

