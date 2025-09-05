import React from 'react';

import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import { SurahVerseList } from '../SurahVerseList';

import type { Verse } from '@/types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('SurahVerseList', () => {
  const baseProps = {
    loadMoreRef: { current: null } as unknown as React.RefObject<HTMLDivElement | null>,
    isValidating: false,
    isReachingEnd: false,
  };

  it('shows spinner while loading', () => {
    renderWithProviders(<SurahVerseList verses={[]} isLoading error={null} {...baseProps} />);

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('shows error state', () => {
    renderWithProviders(
      <SurahVerseList
        verses={[]}
        isLoading={false}
        error="Failed to load content."
        {...baseProps}
      />
    );
    expect(screen.getByText(/Failed to load content/)).toBeInTheDocument();
  });

  it('renders verses and end-of-surah indicator', () => {
    renderWithProviders(
      <SurahVerseList
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
        {...baseProps}
      />
    );

    // Verse container rendered
    expect(document.querySelector('#verse-1')).toBeInTheDocument();

    // End marker uses i18n key
    expect(screen.getByText('end_of_surah')).toBeInTheDocument();
  });
});
