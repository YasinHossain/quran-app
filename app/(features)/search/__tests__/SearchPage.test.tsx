import { screen, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';

import SearchPage from '@/app/(features)/search/page';
import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import { advancedSearch } from '@/lib/api/search';

import type { MockProps } from '@/tests/mocks';

jest.mock('@/lib/api/search', () => ({
  advancedSearch: jest.fn(),
}));

jest.mock('@/app/(features)/surah/components', () => ({
  VerseCard: ({ verse }: MockProps<{ verse: { text_uthmani: string } }>) => (
    <div>{verse.text_uthmani}</div>
  ),
}));

afterEach(() => {
  jest.clearAllMocks();
});

test('a query triggers a fetch and renders returned verses', async () => {
  (useSearchParams as jest.Mock).mockReturnValue({
    get: (key: string) => (key === 'query' ? 'earth' : null),
  });

  (advancedSearch as jest.Mock).mockResolvedValue({
    navigation: [],
    verses: [
      {
        verseKey: '1:1',
        verseId: 1,
        surahNumber: 1,
        verseNumber: 1,
        textArabic: 'earth verse',
        highlightedTranslation: 'earth verse',
        translationName: 'Sahih International',
      },
    ],
    pagination: {
      currentPage: 1,
      nextPage: null,
      totalPages: 1,
      totalRecords: 1,
    },
  });

  await renderWithProvidersAsync(<SearchPage />);

  await waitFor(() => {
    expect(advancedSearch).toHaveBeenCalledWith(
      'earth',
      expect.objectContaining({
        page: 1,
        size: 10,
      })
    );
  });

  await screen.findByText('search_match_label');
  const resultText = document.querySelector('.search-result-text');
  expect(resultText).toHaveTextContent('earth verse');
});

test('fetch rejection shows the error message', async () => {
  (useSearchParams as jest.Mock).mockReturnValue({
    get: (key: string) => (key === 'query' ? 'earth' : null),
  });
  (advancedSearch as jest.Mock).mockRejectedValue(new Error('Failed to load results.'));

  await renderWithProvidersAsync(<SearchPage />);

  expect(await screen.findByText('Failed to load results.')).toBeInTheDocument();
});
