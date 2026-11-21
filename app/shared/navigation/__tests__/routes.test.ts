import {
  buildJuzRoute,
  buildPageRoute,
  buildSearchRoute,
  buildSurahRoute,
  buildTafsirRoute,
  buildVerseRoute,
} from '@/app/shared/navigation/routes';

describe('navigation route helpers', () => {
  it('builds surah routes with encoding', () => {
    expect(buildSurahRoute(1)).toBe('/surah/al-fatihah');
    expect(buildSurahRoute('1')).toBe('/surah/al-fatihah');
    expect(buildSurahRoute('Al-Fatihah')).toBe('/surah/al-fatihah');
    expect(buildSurahRoute('al-baqarah')).toBe('/surah/al-baqarah');
    expect(buildSurahRoute('not a surah')).toBe('/surah/not%20a%20surah');
    expect(buildSurahRoute(2, { startVerse: 255 })).toBe('/surah/al-baqarah#startVerse=255');
    expect(buildSurahRoute(2, { startVerse: '  50 ' })).toBe('/surah/al-baqarah#startVerse=50');
    expect(buildSurahRoute(2, { startVerse: 0 })).toBe('/surah/al-baqarah');
  });

  it('builds slug verse routes', () => {
    expect(buildVerseRoute(2, 255)).toBe('/surah/al-baqarah/255');
    expect(buildVerseRoute('36', 45)).toBe('/surah/ya-sin/45');
  });

  it('builds juz routes', () => {
    expect(buildJuzRoute(5)).toBe('/juz/5');
  });

  it('builds page routes', () => {
    expect(buildPageRoute(120)).toBe('/page/120');
  });

  it('builds tafsir routes with two parameters', () => {
    expect(buildTafsirRoute(2, 255)).toBe('/tafsir/al-baqarah/255');
  });

  it('builds search routes with encoded query string', () => {
    expect(buildSearchRoute('Surah Rahman')).toBe('/search?query=Surah%20Rahman');
  });
});
