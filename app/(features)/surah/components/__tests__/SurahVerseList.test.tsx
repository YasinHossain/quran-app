import React from 'react';

import { SurahVerseList } from '@/app/(features)/surah/components/SurahVerseList';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import type { Verse } from '@/types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('SurahVerseList', () => {
  const baseProps = {
    loadMoreRef: { current: null } as unknown as React.RefObject<HTMLDivElement | null>,
    isValidating: false,
  };

  it('shows spinner while loading', () => {
    renderWithProviders(
      <SurahVerseList {...baseProps} verses={[]} isLoading error={null} isReachingEnd={false} />
    );

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('shows error state', () => {
    renderWithProviders(
      <SurahVerseList
        {...baseProps}
        verses={[]}
        isLoading={false}
        error="Failed to load content."
        isReachingEnd={false}
      />
    );
    expect(screen.getByText(/Failed to load content/)).toBeInTheDocument();
  });

  it('renders verses and end-of-surah indicator', () => {
    renderWithProviders(
      <SurahVerseList
        {...baseProps}
        verses={[
          {
            id: 1,
            verse_key: '1:1',
            text_uthmani: '',
            words: [],
            translations: [],
          } as Verse,
        ]}
        isLoading={false}
        error={null}
        isReachingEnd
      />
    );

    // Verse container rendered
    expect(document.querySelector('#verse-1')).toBeInTheDocument();

    // End marker uses i18n key
    expect(screen.getByText('end_of_surah')).toBeInTheDocument();
  });
});
