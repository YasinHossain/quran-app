import {
  buildJuzRoute,
  buildPageRoute,
  buildSearchRoute,
  buildSurahRoute,
  buildTafsirRoute,
} from '@/app/shared/navigation/routes';

describe('navigation route helpers', () => {
  it('builds surah routes with encoding', () => {
    expect(buildSurahRoute(1)).toBe('/surah/1');
    expect(buildSurahRoute('Al-Fatihah')).toBe('/surah/Al-Fatihah');
  });

  it('builds juz routes', () => {
    expect(buildJuzRoute(5)).toBe('/juz/5');
  });

  it('builds page routes', () => {
    expect(buildPageRoute(120)).toBe('/page/120');
  });

  it('builds tafsir routes with two parameters', () => {
    expect(buildTafsirRoute(2, 255)).toBe('/tafsir/2/255');
  });

  it('builds search routes with encoded query string', () => {
    expect(buildSearchRoute('Surah Rahman')).toBe('/search?query=Surah%20Rahman');
  });
});
