import userEvent from '@testing-library/user-event';
import React from 'react';
import useSWR from 'swr';

import { SurahListSidebar } from '@/app/shared/SurahListSidebar';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import { useParams, usePathname } from 'next/navigation';

jest.mock('swr', () => {
  const actual = jest.requireActual('swr');
  return { __esModule: true, ...actual, default: jest.fn() };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseSWR = useSWR as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

const chapters = [
  {
    id: 1,
    name_simple: 'Al-Fatihah',
    name_arabic: 'الفاتحة',
    revelation_place: 'meccan',
    verses_count: 7,
    pages: [1, 1],
  },
  {
    id: 2,
    name_simple: 'Al-Baqarah',
    name_arabic: 'البقرة',
    revelation_place: 'medinan',
    verses_count: 286,
    pages: [2, 49],
  },
];

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  mockUseSWR.mockReturnValue({ data: chapters });
  mockUseParams.mockReturnValue({});
  mockUsePathname.mockReturnValue('/surah');
});

describe('SurahListSidebar', () => {
  it('switches between Surah, Juz, and Page tabs', async () => {
    renderWithProviders(<SurahListSidebar />);

    expect(await screen.findByText('Al-Fatihah')).toBeInTheDocument();

    await userEvent.click(await screen.findByRole('button', { name: 'juz_tab' }));
    expect(await screen.findByText('Juz 1')).toBeInTheDocument();
    expect(screen.queryByText('Al-Fatihah')).not.toBeInTheDocument();

    await userEvent.click(await screen.findByRole('button', { name: 'page_tab' }));
    expect(await screen.findByText('Page 1')).toBeInTheDocument();
    expect(screen.queryByText('Juz 1')).not.toBeInTheDocument();
  });

  it('filters items when searching', async () => {
    renderWithProviders(<SurahListSidebar />);

    const input = await screen.findByPlaceholderText('search_surah');
    await userEvent.type(input, '2');

    expect(await screen.findByText('Al-Baqarah')).toBeInTheDocument();
    expect(screen.queryByText('Al-Fatihah')).not.toBeInTheDocument();
  });

  it('updates selection state when an item is clicked', async () => {
    renderWithProviders(<SurahListSidebar />);

    await userEvent.click(await screen.findByText('Al-Baqarah'));
    const link = (await screen.findByText('Al-Baqarah')).closest('a');
    expect(link).toHaveAttribute('data-active', 'true');
  });
});
