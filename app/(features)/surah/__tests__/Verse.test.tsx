import { screen, waitFor } from '@testing-library/react';

import { VerseCard as VerseComponent } from '@/app/(features)/surah/components';
import { TranslationProvider } from '@/app/providers/TranslationProvider';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import { Verse } from '@/types';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const verse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'بِسْمِ الله',
  words: [
    { id: 1, uthmani: 'بِسْمِ', en: 'In' },
    { id: 2, uthmani: 'الله', en: 'Allah' },
  ],
};

const renderVerse = () =>
  renderWithProvidersAsync(
    <TranslationProvider>
      <VerseComponent verse={verse} />
    </TranslationProvider>
  );

describe('Verse word-by-word font size', () => {
  beforeAll(() => {
    setMatchMedia(false);
  });
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      'quranAppSettings',
      JSON.stringify({ arabicFontSize: 40, showByWords: true })
    );
  });

  it('scales word translation with arabic font size', async () => {
    await renderVerse();
    const word = await screen.findByText('In');
    await waitFor(() => {
      expect(word).toHaveStyle('font-size: 20px');
    });
  });
});
