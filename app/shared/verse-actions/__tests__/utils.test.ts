import { buildVerseShareUrl } from '@/app/shared/verse-actions/utils';

const at = (pathname: string) => ({ origin: 'https://appquran.com', pathname });

describe('buildVerseShareUrl', () => {
  it('shares the verse page in the language of the current page', () => {
    expect(buildVerseShareUrl('2:255', at('/surah/al-baqarah'))).toBe(
      'https://appquran.com/surah/al-baqarah/255'
    );
    expect(buildVerseShareUrl('36:45', at('/bn/juz/23'))).toBe(
      'https://appquran.com/bn/surah/ya-sin/45'
    );
  });

  it('rejects malformed verse keys', () => {
    expect(buildVerseShareUrl('2', at('/surah/al-baqarah'))).toBeNull();
    expect(buildVerseShareUrl('2:abc', at('/surah/al-baqarah'))).toBeNull();
  });
});
