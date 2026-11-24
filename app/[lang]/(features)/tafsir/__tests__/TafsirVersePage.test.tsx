import { render, screen } from '@testing-library/react';

import { AyahNavigation } from '@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/components/AyahNavigation';
import TafsirVersePage from '@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/page';

import type { Surah } from '@/types';

const CHAPTERS = [
  { id: 1, verses_count: 7 },
  { id: 2, verses_count: 286 },
  { id: 114, verses_count: 6 },
];

jest.mock('@/lib/api/server', () => ({
  getChaptersServer: async () => CHAPTERS,
  toVerseCounts: (chapters: typeof CHAPTERS) => {
    // Real surah lengths are needed only up to the ids used here.
    const counts = Array.from({ length: 114 }, () => 1);
    chapters.forEach((c) => (counts[c.id - 1] = c.verses_count));
    return counts;
  },
  getTafsirVersePageDataServer: async () => ({
    verse: { verse_key: '1:7' },
    tafsirHtml: '<p>Tafsir</p>',
    tafsirResource: undefined,
  }),
}));
// The real client needs app providers; the server page only hands it the neighbours.
jest.mock(
  '@/app/[lang]/(features)/tafsir/[surahId]/[ayahId]/components/TafsirVersePageClient',
  () => ({
    __esModule: true,
    default: () => null,
  })
);

const currentSurah: Surah = {
  number: 1,
  name: 'Al-Fatiha',
  arabicName: 'الفاتحة',
  verses: 7,
  meaning: 'The Opening',
};

test('next link points to next verse', () => {
  render(
    <AyahNavigation
      prev={{ surahId: '1', ayahId: 7 }}
      next={{ surahId: '1', ayahId: 2 }}
      currentSurah={currentSurah}
      surahId="1"
      ayahId="1"
    />
  );

  const nextLink = screen.getByLabelText('Next');
  expect(nextLink).toHaveAttribute('href', '/tafsir/al-fatihah/2');
});

test('previous link points to previous verse', () => {
  render(
    <AyahNavigation
      prev={{ surahId: '1', ayahId: 7 }}
      next={{ surahId: '1', ayahId: 2 }}
      currentSurah={currentSurah}
      surahId="2"
      ayahId="1"
    />
  );

  const prevLink = screen.getByLabelText('Previous');
  expect(prevLink).toHaveAttribute('href', '/tafsir/al-fatihah/7');
});

describe('server-rendered neighbours', () => {
  const neighbours = async (surahId: string, ayahId: string) => {
    const element = await TafsirVersePage({
      params: Promise.resolve({ lang: 'en', surahId, ayahId }),
    });
    const { initialPrev, initialNext } = element.props;
    render(
      <AyahNavigation
        prev={initialPrev}
        next={initialNext}
        surahId={element.props.surahId}
        ayahId={element.props.ayahId}
      />
    );
    return {
      prev: screen.queryByRole('link', { name: 'Previous' }),
      next: screen.queryByRole('link', { name: 'Next' }),
    };
  };

  test('last verse of a surah links to the first verse of the next, with rel', async () => {
    const { prev, next } = await neighbours('al-fatihah', '7');
    expect(next).toHaveAttribute('href', '/tafsir/al-baqarah/1');
    expect(next).toHaveAttribute('rel', 'next');
    expect(prev).toHaveAttribute('href', '/tafsir/al-fatihah/6');
    expect(prev).toHaveAttribute('rel', 'prev');
  });

  test('first verse of a surah links back to the last verse of the previous', async () => {
    const { prev } = await neighbours('al-baqarah', '1');
    expect(prev).toHaveAttribute('href', '/tafsir/al-fatihah/7');
  });

  test('the last verse of the Quran has no next link', async () => {
    const { prev, next } = await neighbours('an-nas', '6');
    expect(next).toBeNull();
    expect(prev).toHaveAttribute('href', '/tafsir/an-nas/5');
  });
});
