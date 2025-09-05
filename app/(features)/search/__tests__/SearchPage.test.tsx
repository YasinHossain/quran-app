import { render, screen, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';

import SearchPage from '@/app/(features)/search/page';
import { searchVerses } from '@/lib/api';

import type { MockProps } from '@/tests/mocks';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  searchVerses: jest.fn(),
}));

jest.mock('@/app/(features)/surah/[surahId]/components/Verse', () => ({
  Verse: ({ verse }: MockProps<{ verse: { text_uthmani: string } }>) => (
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
  (searchVerses as jest.Mock).mockResolvedValue([
    { id: 1, verse_key: '1:1', text_uthmani: 'earth verse' },
  ]);

  render(<SearchPage />);

  await waitFor(() => {
    expect(searchVerses).toHaveBeenCalledWith('earth');
  });

  expect(await screen.findByText('earth verse')).toBeInTheDocument();
});

test('fetch rejection shows the error message', async () => {
  (useSearchParams as jest.Mock).mockReturnValue({
    get: (key: string) => (key === 'query' ? 'earth' : null),
  });
  (searchVerses as jest.Mock).mockRejectedValue(new Error('fail'));

  render(<SearchPage />);

  expect(await screen.findByText('Failed to load results.')).toBeInTheDocument();
});
