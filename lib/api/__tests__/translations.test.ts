import { API_BASE_URL } from '@/lib/api';
import { getTranslations, getWordTranslations } from '@/lib/api/translations';
import { TranslationResource } from '@/types';

describe('getTranslations', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches translations', async () => {
    const apiResponse = [{ id: 1, name: 'Saheeh', language_name: 'English' }];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ translations: apiResponse }),
    }) as jest.Mock;

    const result = await getTranslations();
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/resources/translations`,
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
    const expected: TranslationResource[] = [{ id: 1, name: 'Saheeh', lang: 'English' }];
    expect(result).toEqual(expected);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;
    await expect(getTranslations()).rejects.toThrow('Failed to fetch translations: 500');
  });
});

describe('getWordTranslations', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches word-by-word translations', async () => {
    const apiResponse = [{ id: 1, name: 'WBW', language_name: 'English' }];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ translations: apiResponse }),
    }) as jest.Mock;

    const result = await getWordTranslations();
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/resources/translations?resource_type=word_by_word`,
      expect.objectContaining({ headers: { Accept: 'application/json' } })
    );
    const expected: TranslationResource[] = [{ id: 1, name: 'WBW', lang: 'English' }];
    expect(result).toEqual(expected);
  });

  it('throws on fetch error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 }) as jest.Mock;
    await expect(getWordTranslations()).rejects.toThrow('Failed to fetch translations: 404');
  });
});
