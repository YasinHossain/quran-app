import { fireEvent, screen, waitFor } from '@testing-library/react';
import React, { useEffect } from 'react';

import { VerseCard as VerseComponent } from '@/app/[lang]/(features)/surah/components';
import { resetLastReadTracking } from '@/app/[lang]/(features)/surah/components/verse-card/useVerseLastReadObserver';
import { TranslationProvider } from '@/app/providers/TranslationProvider';
import { useAudio } from '@/app/shared/player/context/AudioContext';
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

// The reader shares one IntersectionObserver; capture it to move verses across the reading line.
const readingLine: { callback?: IntersectionObserverCallback; observed: Element[] } = {
  observed: [],
};

beforeAll(() => {
  class CapturingIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      readingLine.callback = callback;
    }
    observe = (element: Element): void => {
      readingLine.observed.push(element);
    };
    unobserve = (): void => {};
    disconnect = (): void => {};
  }
  window.IntersectionObserver =
    CapturingIntersectionObserver as unknown as typeof IntersectionObserver;
  global.IntersectionObserver = window.IntersectionObserver;
});

const VerseWrapper = ({ hidePlayer }: { hidePlayer?: boolean }): React.JSX.Element => {
  const { closePlayer } = useAudio();
  useEffect(() => {
    if (hidePlayer) {
      closePlayer();
    }
  }, [closePlayer, hidePlayer]);
  return <VerseComponent verse={verse} />;
};

const renderVerse = (options?: {
  hidePlayer?: boolean;
}): ReturnType<typeof renderWithProvidersAsync> =>
  renderWithProvidersAsync(
    <TranslationProvider initialLanguage="en">
      <VerseWrapper hidePlayer={options?.hidePlayer} />
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
    await renderVerse({ hidePlayer: true });

    expect(screen.queryByText('WBW_In')).not.toBeInTheDocument();
    await screen.findByText('بِسْمِ');
    fireEvent.click(screen.getByText('بِسْمِ'));
    expect(await screen.findByText('WBW_In')).toBeInTheDocument();
  });
});

describe('Verse last-read tracking', () => {
  beforeAll(() => {
    setMatchMedia(false);
  });
  beforeEach(() => {
    localStorage.clear();
    readingLine.observed = [];
  });

  const crossReadingLine = (): void => {
    const target = readingLine.observed.at(-1);
    if (!target || !readingLine.callback) throw new Error('verse is not observed');
    readingLine.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  };

  const savedVerseKey = (): unknown =>
    JSON.parse(localStorage.getItem('quranAppLastRead_v1') ?? '{}')['1']?.verseKey;

  it('does not save a verse shown on open until the reader scrolls', async () => {
    const stopTracking = resetLastReadTracking();
    await renderVerse({ hidePlayer: true });

    crossReadingLine();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(savedVerseKey()).toBeUndefined();

    fireEvent.wheel(window);
    crossReadingLine();
    await waitFor(() => expect(savedVerseKey()).toBe('1:1'));
    stopTracking();
  });
});
