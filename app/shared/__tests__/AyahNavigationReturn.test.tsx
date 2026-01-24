import { render, screen } from '@testing-library/react';

import { AyahNavigation } from '@/app/(features)/tafsir/[surahId]/[ayahId]/components/AyahNavigation';

describe('AyahNavigation return behavior', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('uses stored tafsir return href for the back link', () => {
    window.sessionStorage.setItem(
      'quranAppTafsirReturn_v1',
      JSON.stringify({ href: '/surah/2#startVerse=200&nav=123', createdAt: 123 })
    );

    render(<AyahNavigation prev={null} next={null} ayahId="4" surahId="2" />);

    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/surah/2#startVerse=200&nav=123'
    );
  });

  it('falls back to the current ayah when no return href is stored', () => {
    jest.spyOn(Date, 'now').mockReturnValue(123);

    render(<AyahNavigation prev={null} next={null} ayahId="4" surahId="2" />);

    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute(
      'href',
      '/surah/2#startVerse=4&nav=123'
    );
  });
});
