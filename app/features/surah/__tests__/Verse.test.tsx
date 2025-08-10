import { render, screen, waitFor } from '@testing-library/react';
import { Verse as VerseComponent } from '@/app/features/surah/[surahId]/_components/Verse';
import { SettingsProvider } from '@/app/context/SettingsContext';
import { AudioProvider } from '@/app/features/player/context/AudioContext';
import TranslationProvider from '@/app/providers/TranslationProvider';
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
  render(
    <TranslationProvider>
      <AudioProvider>
        <SettingsProvider>
          <VerseComponent verse={verse} />
        </SettingsProvider>
      </AudioProvider>
    </TranslationProvider>
  );

describe('Verse word-by-word font size', () => {
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
