import { render, screen } from '@testing-library/react';

import { AyahNavigation } from '@/app/(features)/tafsir/[surahId]/[ayahId]/components/AyahNavigation';

import type { Surah } from '@/types';

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
  expect(nextLink).toHaveAttribute('href', '/tafsir/1/2');
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
  expect(prevLink).toHaveAttribute('href', '/tafsir/1/7');
});
