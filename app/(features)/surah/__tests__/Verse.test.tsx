import { screen, waitFor } from '@testing-library/react';
import { VerseCard as VerseComponent } from '@/app/(features)/surah/components';
import { TranslationProvider } from '@/app/providers/TranslationProvider';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
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
  renderWithProviders(
    <TranslationProvider>
      <VerseComponent verse={verse} />
    </TranslationProvider>
  );

describe('Verse word-by-word font size', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      'quranAppSettings',
      JSON.stringify({ arabicFontSize: 40, showByWords: true })
    );
  });

  it('scales word translation with arabic font size', async () => {
    renderVerse();
    const word = await screen.findByText('In');
    await waitFor(() => {
      expect(word).toHaveStyle('font-size: 20px');
    });
  });
});
