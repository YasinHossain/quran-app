import { fireEvent, screen, waitFor } from '@testing-library/react';

import { VerseCard as VerseComponent } from '@/app/(features)/surah/components';
import { TranslationProvider } from '@/app/providers/TranslationProvider';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import { Verse } from '@/types';

const verse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'بِسْمِ الله',
  words: [
    { id: 1, uthmani: 'بِسْمِ', en: 'WBW_In' },
    { id: 2, uthmani: 'الله', en: 'WBW_Allah' },
  ],
};

const renderVerse = (): ReturnType<typeof renderWithProvidersAsync> =>
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
    const word = await screen.findByText('WBW_In');
    await waitFor(() => {
      expect(word).toHaveStyle('font-size: 20px');
    });
  });
});

describe('Verse word translation popover', () => {
  beforeAll(() => {
    setMatchMedia(false);
  });
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('quranAppSettings', JSON.stringify({ showByWords: false }));
  });

  it('shows word translation on click', async () => {
    await renderVerse();

    expect(screen.queryByText('WBW_In')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('بِسْمِ'));
    expect(await screen.findByText('WBW_In')).toBeInTheDocument();
  });
});
